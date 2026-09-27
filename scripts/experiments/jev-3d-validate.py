"""Read-only geometry checks for the synthetic eight-ring experiment."""
import bpy
import json
import sys
from mathutils import Vector
from pathlib import Path

workspace = Path(sys.argv[sys.argv.index('--') + 1])

def measure():
    bpy.context.view_layer.update()
    meshes = [o for o in bpy.data.objects if o.type == 'MESH']
    bounds = {}
    for o in meshes:
        points = [o.matrix_world @ Vector(v) for v in o.bound_box]
        low = [min(p[i] for p in points) for i in range(3)]
        high = [max(p[i] for p in points) for i in range(3)]
        bounds[o.name] = {'dimensions': [high[i]-low[i] for i in range(3)], 'centerZ': (high[2]+low[2])/2, 'lowZ': low[2], 'highZ': high[2]}
    rings = [o for o in meshes if all(abs(a-b) < .025 for a,b in zip(bounds[o.name]['dimensions'], [1.2,1.2,.12]))]
    rings.sort(key=lambda o: bounds[o.name]['centerZ'])
    plinths = [o for o in meshes if all(abs(a-b) < .025 for a,b in zip(bounds[o.name]['dimensions'], [1.6,1.6,.2]))]
    spacing = [bounds[rings[i+1].name]['centerZ'] - bounds[rings[i].name]['centerZ'] for i in range(len(rings)-1)]
    clearance = bounds[rings[0].name]['lowZ'] - max(bounds[o.name]['highZ'] for o in plinths) if rings and plinths else None
    return {'meshCount': len(meshes), 'ringNames': [o.name for o in rings], 'ringDimensions': [bounds[o.name]['dimensions'] for o in rings],
            'ringZ': [bounds[o.name]['centerZ'] for o in rings], 'spacing': spacing, 'plinthNames': [o.name for o in plinths], 'clearance': clearance,
            'cameraCount': sum(o.type == 'CAMERA' for o in bpy.data.objects),
            'hasMaterials': all(len(o.data.materials) > 0 for o in rings + plinths),
            'geometryPass': len(rings) == 8 and len(plinths) >= 1 and all(abs(s - .25) < .01 for s in spacing) and clearance >= -.005}

blend = measure()
glbs = sorted(p for p in workspace.rglob('*.glb') if 'harness-home' not in p.parts)
export = None
if glbs:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(glbs[0]))
    export = measure()
(workspace / 'geometry-validation.json').write_text(json.dumps({'blend': blend, 'glb': export}, indent=2) + '\n')
print('ATELIER_GEOMETRY_VALIDATION', json.dumps({'blendPass': blend['geometryPass'], 'glbPass': export and export['geometryPass']}))
