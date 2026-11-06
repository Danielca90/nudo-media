import sys,os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "scripts"))
from nudo_bpy import *
escena_nueva(muestras=24,resolucion=(900,600))
obs=[]
for i,t in enumerate(["pino","roble","nogal","cedro"]):
    b=caja(t,-0.3,-0.06+i*0.13-0.2,0,0.3,0.06+i*0.13-0.2,0.018,bisel=0.002); asignar(b,material_madera(t,t)); obs.append(b)
piso(4); sol()
cam=camara(lente=50); encuadrar(cam,obs,direccion=(0.5,-1,1.4),margen=0.95)
render(sys.argv[-1])
