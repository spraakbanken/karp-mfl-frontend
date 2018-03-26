import urllib.request


base = "http://localhost:5000"
calls = ["/lexicon","/lexicon/saldomp","/paradigminfo?short=true","/pos",
         "/inflect", "/inflectclass","/inflectlike","/inflecttable",
         "/compile?s=wf", "/compile?s=paradigm","/compile?classname=bklass",
         "/compile?classname=fmparadigms","/list?classname=bklass",
         "/list?s=paradigm", "/paradigminfo?short=false"]

errors = []
for call in calls:
    try:
        urllib.request.urlopen(base + call)
    except urllib.error.HTTPError as e:
        
        print(e.code)
        print(e.read())
        print("-----------------------------------------------")
        print("Error in: " + call)
        print("-----------------------------------------------")
        errors.append(call)

if errors:
    print("FAIL")
else:
    print("NOT FAIL")
