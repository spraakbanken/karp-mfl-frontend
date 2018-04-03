from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
import logging
import sys
import json

app = Flask(__name__)
CORS(app)

@app.route('/lexicon')
@app.route('/lexicon/<lex>')
def lexiconinfo(lex=''):
    lex = request.args.get('lexicon', lex)
    if not lex:
        return jsonify(json.load(open("static/lexicon.json")))
    elif lex == "saldomp":
        return jsonify(json.load(open("static/lexiconsaldomp.json")))
    else:
        return jsonify(json.load(open("static/lexiconother.json")))


@app.route('/paradigminfo')
def paradigminfo():
    short = bool(request.args.get('short', "true"))
    # url: /paradigminfo?paradigm=p15_pryd..av.1?short=true
    if short:
        file = "paradigminfoshort.json"
    else:
        file = "paradigminfolong.json"
    return jsonify(json.load(open("static/" + file)))


@app.route('/pos')
@app.route('/partofspeech')
def all_pos():
    # url: /partofspeech?lexicon=saldomp
         # /pos?lexicon=saldomp
    return jsonify(json.load(open("static/pos.json")))


@app.route('/inflectclass')
def inflectclass():
    # url: /inflectclass?word=apa&bklass=3&pos=nn
    return jsonify(json.load(open("static/inflectclass.json")))
    

@app.route('/inflect')
def inflect():
    # /inflect?table=apa
    return jsonify(json.load(open("static/inflect.json")))

@app.route('/inflectlike')
def inflectlike():
    # url: /inflectclass?word=katta&like=flicka..nn.1&pos=nn
    return jsonify(json.load(open("static/inflectlike.json")))


@app.route('/inflecttable')
def inflecttable():
    # url: /inflect?table=apa|sg+indef+nom,apan|sg+def+nom
    return jsonify(json.load(open("static/inflecttable.json")))


@app.route('/compile')
def compile():
    s = request.args.get('s', '*')
    if s == "wf":
        # url: '/compile?s=wf'
        return jsonify(json.load(open("static/compilewf.json")))
    elif s == "paradigm":
        # url: '/compile?s=paradigm'
        return jsonify(json.load(open("static/compileparadigm.json")))
    elif request.args.get("classname", "") == "bklass":
        # url: '/compile?s=class&classname=bklass'
        return jsonify(json.load(open("static/compilebklass.json")))
    elif request.args.get("classname", "") == "fmparadigms":
        # url: '/compile?s=class&classname=fmparadigms'
        return jsonify(json.load(open("static/compilefmparadigms.json")))

@app.route('/list')
def list():
    if request.args.get("classname", "") == "bklass":
        # url: '/list?s=class&classname=bklass'
        # Visar alla klasser i en kategori + deras antal.
        # Bklasserna heter "0", "1", "2"...
        return jsonify(json.load(open("static/listbklass.json")))
    if request.args.get("s", "") == "paradigm":
        # url: '/list?s=paradigm'
        return jsonify(json.load(open("static/listparadigm.json")))


if __name__ == '__main__':
    app.run(debug=True)
