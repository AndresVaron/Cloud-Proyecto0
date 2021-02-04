import os
from flask import Flask, request, render_template, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_restful import Api, Resource

app = Flask(__name__, static_folder="frontend/build/static",
            template_folder="frontend/build")

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
ma = Marshmallow(app)
api = Api(app)


class Evento(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50))
    categoria = db.Column(db.String(255))
    lugar = db.Column(db.String(255))
    direccion = db.Column(db.String(255))
    fechaIni = db.Column(db.String(50))
    fechaFin = db.Column(db.String(50))
    presencial = db.Column(db.Integer)
    correo = db.Column(db.String(255))


class Evento_Shema(ma.Schema):
    class Meta:
        fields = ("id", "nombre", "categoria", "lugar",
                  "direccion", "fechaIni", "fechaFin", "presencial", "correo")


class Usuario(db.Model):
    correo = db.Column(db.String(255), primary_key=True)
    clave = db.Column(db.String(255))


class Usuario_Shema(ma.Schema):
    class Meta:
        fields = ("correo", "clave")


event_schema = Evento_Shema()
events_schema = Evento_Shema(many=True)
user_schema = Usuario_Shema()


class RecursoListarEventos(Resource):
    def get(self):
        usuario = Usuario.query.get_or_404(request.args.get('correo'))
        if usuario.clave != request.args.get('clave'):
            return 'NOT AUTH', 401

        eventos = Evento.query.all()
        eventos = [a for a in eventos if a.correo ==
                   request.args.get('correo')]
        eventos.sort(key=lambda x: x.fechaIni, reverse=True)
        return events_schema.dump(eventos)

    def post(self):
        usuario = Usuario.query.get_or_404(request.args.get('correo'))
        if usuario.clave != request.args.get('clave'):
            return 'NOT AUTH', 401

        categoria = request.json['categoria']
        if categoria not in ["Conferencia", "Seminario", "Congreso", "Curso"]:
            return 'Categoria Erronea', 403
        nuevo_evento = Evento(
            nombre=request.json['nombre'],
            categoria=request.json['categoria'],
            lugar=request.json['lugar'],
            direccion=request.json['direccion'],
            fechaIni=request.json['fechaIni'],
            fechaFin=request.json['fechaFin'],
            presencial=request.json['presencial'],
            correo=request.args.get('correo')
        )
        db.session.add(nuevo_evento)
        db.session.commit()
        return event_schema.dump(nuevo_evento)


class RecursoUnEvento(Resource):
    def get(self, id):
        usuario = Usuario.query.get_or_404(request.args.get('correo'))
        if usuario.clave != request.args.get('clave'):
            return 'NOT AUTH', 401
        evento = Evento.query.get_or_404(id)
        if evento.correo != request.args.get('correo'):
            return 'NOT AUTH', 401
        return event_schema.dump(evento)

    def put(self, id):
        usuario = Usuario.query.get_or_404(request.args.get('correo'))
        if usuario.clave != request.args.get('clave'):
            return 'NOT AUTH', 401

        evento = Evento.query.get_or_404(id)
        if evento.correo != request.args.get('correo'):
            return 'NOT AUTH', 401

        if 'nombre' in request.json:
            evento.nombre = request.json['nombre']
        if 'categoria' in request.json:
            categoria = request.json['categoria']
            if categoria not in ["Conferencia", "Seminario", "Congreso", "Curso"]:
                return 'Categoria Erronea', 403
            evento.categoria = request.json['categoria']
        if 'lugar' in request.json:
            evento.lugar = request.json['lugar']
        if 'direccion' in request.json:
            evento.direccion = request.json['direccion']
        if 'fechaIni' in request.json:
            evento.fechaIni = request.json['fechaIni']
        if 'fechaFin' in request.json:
            evento.fechaFin = request.json['fechaFin']
        if 'presencial' in request.json:
            evento.presencial = request.json['presencial']
        db.session.commit()
        return event_schema.dump(evento)

    def delete(self, id):
        usuario = Usuario.query.get_or_404(request.args.get('correo'))
        if usuario.clave != request.args.get('clave'):
            return 'NOT AUTH', 401

        evento = Evento.query.get_or_404(id)
        if evento.correo != request.args.get('correo'):
            return 'NOT AUTH', 401

        db.session.delete(evento)
        db.session.commit()
        return '', 204


class RecursoUsuarios(Resource):
    def post(self):
        print(request)
        nuevo_usuario = Usuario(
            correo=request.json['correo'],
            clave=request.json['clave']
        )
        db.session.add(nuevo_usuario)
        db.session.commit()
        return event_schema.dump(nuevo_usuario)


class RecursoLogin(Resource):
    def post(self):
        print(request)
        usuario = Usuario.query.get_or_404(request.json['correo'])
        if usuario.clave == request.json['clave']:
            return '', 200
        return 'NOT AUTH', 401


class RecursoFrontStatic(Resource):
    def get(self):
        return make_response(render_template('index.html'))


api.add_resource(RecursoFrontStatic, '/')
api.add_resource(RecursoListarEventos, '/api/eventos')
api.add_resource(RecursoUnEvento, '/api/eventos/<int:id>')
api.add_resource(RecursoUsuarios, '/api/usuarios')
api.add_resource(RecursoLogin, '/api/login')

if __name__ == '__main__':
    app.run(debug=True)
