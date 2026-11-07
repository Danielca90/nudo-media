"""OBJ de la maceta maciza (perfil suavizado, revolución), con paneles: 8 gajos + tapa + base."""
import numpy as np, sys
perfil = np.array([(.66,0),(.98,.2),(1.12,.45),(1.06,.7),(.94,.86),(1.12,.94),(1.12,1.04)])
# Chaikin para suavizar (como el Subdivision Surface), conservando extremos
P = perfil
for _ in range(4):
    Q=[P[0]]
    for a,b in zip(P[:-1],P[1:]): Q += [.75*a+.25*b, .25*a+.75*b]
    Q.append(P[-1]); P=np.array(Q)
# remuestrear por longitud de arco
d=np.r_[0,np.cumsum(np.linalg.norm(np.diff(P,axis=0),axis=1))]
s=np.linspace(0,d[-1],34); side=np.c_[np.interp(s,d,P[:,0]),np.interp(s,d,P[:,1])]
rb, rt, zt = side[0,0], side[-1,0], side[-1,1]
cap_n=8
bottom=[(rb*t,0.0) for t in np.linspace(0,1,cap_n+1)[1:-1]]
DOMO=0.22
top=[(rt*t,zt+DOMO*(1-t*t)) for t in np.linspace(1,0,cap_n+1)[1:-1]]
prof=[(0,0)]+bottom+[tuple(p) for p in side]+top+[(0,zt+DOMO)]
SEG=64; G=8
V=[];rings=[]
for r,z in prof:
    if r==0: rings.append([len(V)]); V.append((0,0,z))
    else:
        idx=[]
        for i in range(SEG):
            a=2*np.pi*i/SEG; idx.append(len(V)); V.append((r*np.cos(a),r*np.sin(a),z))
        rings.append(idx)
nb=len(bottom)+1; nside0=nb; nside1=nb+len(side)-1
F=[];L=[]
names=[f"gajo{k+1}" for k in range(G)]+["tapa","base"]
for k,(A,B) in enumerate(zip(rings[:-1],rings[1:])):
    for i in range(SEG):
        if k<nb-1 or (len(A)==1): lab=G+1        # base
        elif k>=nside1: lab=G                     # tapa
        else: lab=i*G//SEG
        if len(A)==1: F.append((A[0],B[(i+1)%SEG],B[i]))
        elif len(B)==1: F.append((A[i],A[(i+1)%SEG],B[0]))
        else:
            F.append((A[i],A[(i+1)%SEG],B[(i+1)%SEG])); L.append(lab)
            F.append((A[i],B[(i+1)%SEG],B[i]))
        L.append(lab)
with open(sys.argv[1],"w") as f:
    for v in V: f.write("v %.6f %.6f %.6f\n"%v)
    for p,n in enumerate(names):
        f.write(f"g {n}\n")
        for t,l in zip(F,L):
            if l==p: f.write("f %d %d %d\n"%tuple(x+1 for x in t))
print(len(V),"verts",len(F),"tris")
