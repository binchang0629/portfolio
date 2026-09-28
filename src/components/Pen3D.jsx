import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { assets } from '../assets'

export default function Pen3D({ roll, turn }) {
  const host = useRef(null), canvas = useRef(null)
  useEffect(() => {
    const element = host.current, surface = canvas.current
    let renderer
    try { renderer = new THREE.WebGLRenderer({ canvas: surface, alpha: true, antialias: true, powerPreference: 'low-power' }) }
    catch { return }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-.47, .47, 1.56, -1.56, .1, 20)
    camera.position.set(0, 0, 6); camera.lookAt(0, 0, 0)
    const generator = new THREE.PMREMGenerator(renderer), room = new RoomEnvironment()
    const environment = generator.fromScene(room, .04)
    scene.environment = environment.texture
    scene.environmentIntensity = .65
    room.dispose(); generator.dispose()
    const plastic = new THREE.MeshPhysicalMaterial({ color: '#075edf', metalness: .08, roughness: .24, clearcoat: 1, clearcoatRoughness: .16 })
    const clipPlastic = new THREE.MeshPhysicalMaterial({ color: '#064bbd', metalness: .1, roughness: .2, clearcoat: 1, clearcoatRoughness: .14 })
    const metal = new THREE.MeshStandardMaterial({ color: '#b5bbc2', metalness: .94, roughness: .24 })
    const ink = new THREE.MeshStandardMaterial({ color: '#536170', metalness: .8, roughness: .3 })
    const seam = new THREE.MeshStandardMaterial({ color: '#053e91', metalness: .05, roughness: .5 })
    const orientation = new THREE.Group(), shaft = new THREE.Group()
    orientation.rotation.z = -14 * Math.PI / 180
    orientation.add(shaft); scene.add(orientation)
    const geometries = [], materials = [plastic, clipPlastic, metal, ink, seam]
    const lathe = (profile, material) => {
      const geometry = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 64)
      geometries.push(geometry)
      const mesh = new THREE.Mesh(geometry, material)
      mesh.castShadow = true; shaft.add(mesh); return mesh
    }
    lathe([[0,-1.04],[.057,-1.04],[.065,-1.02],[.071,-.97],[.075,.44],[.078,.49],[.075,.515],[0,.515]], plastic)
    lathe([[0,.513],[.076,.513],[.076,.528],[0,.528]], seam)
    lathe([[0,.528],[.077,.528],[.081,.545],[.081,.99],[.076,1.075],[.069,1.09],[0,1.09]], plastic)
    lathe([[0,.968],[.0815,.968],[.0815,.978],[0,.978]], seam)
    lathe([[0,1.09],[.063,1.09],[.064,1.102],[.062,1.22],[.055,1.23],[0,1.23]], metal)
    lathe([[0,1.225],[.057,1.225],[.061,1.235],[.061,1.36],[.055,1.379],[0,1.381]], plastic)
    lathe([[0,-1.3],[.018,-1.3],[.026,-1.28],[.057,-1.055],[.057,-1.04],[0,-1.04]], metal)
    lathe([[0,-1.41],[.005,-1.41],[.013,-1.385],[.017,-1.302],[0,-1.302]], metal)
    lathe([[0,-1.427],[.004,-1.427],[.005,-1.41],[0,-1.41]], ink)
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(.075,1.047,.02), new THREE.Vector3(.101,1.013,.02),
      new THREE.Vector3(.11,.9,.02), new THREE.Vector3(.108,.47,.02),
      new THREE.Vector3(.106,.24,.02), new THREE.Vector3(.084,.19,.02),
    ])
    const clipGeometry = new THREE.TubeGeometry(curve, 40, .014, 10, false)
    geometries.push(clipGeometry)
    const clip = new THREE.Mesh(clipGeometry, clipPlastic)
    clip.scale.z = .65; clip.castShadow = true; shaft.add(clip)
    const floorGeometry = new THREE.PlaneGeometry(5, 5), floorMaterial = new THREE.ShadowMaterial({ color: '#516071', opacity: .13 })
    geometries.push(floorGeometry); materials.push(floorMaterial)
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.position.z = -.087; floor.receiveShadow = true; scene.add(floor)
    const lights = new THREE.Group(); scene.add(lights)
    const sun = new THREE.DirectionalLight('#ffffff', 2.5)
    sun.position.set(-3,4,7); sun.castShadow = true
    sun.shadow.mapSize.set(512,512); sun.shadow.camera.left = -2; sun.shadow.camera.right = 2
    sun.shadow.camera.top = 2; sun.shadow.camera.bottom = -2
    sun.shadow.bias = -.0004; sun.shadow.normalBias = .008; sun.shadow.radius = 4
    lights.add(sun); scene.add(sun.target)
    lights.add(new THREE.HemisphereLight('#f7fbff','#778aab', 1.2))
    const draw = () => {
      const phase = roll.get()
      shaft.rotation.y = phase
      // The protruding clip lifts the cylinder slightly when it rolls underneath.
      shaft.position.z = Math.max(0, .11 * Math.sin(phase) - .02 * Math.cos(phase) - .079)
      lights.rotation.z = turn.get() * Math.PI / 180
      scene.environmentRotation.z = -turn.get() * Math.PI / 180
      renderer.render(scene, camera)
      surface.dataset.roll = phase.toFixed(4)
    }
    const resize = () => {
      const bounds = element.getBoundingClientRect()
      renderer.setSize(Math.max(1, bounds.width), Math.max(1, bounds.height), false)
      draw()
    }
    const observer = new ResizeObserver(resize); observer.observe(element)
    const offRoll = roll.on('change', draw), offTurn = turn.on('change', draw)
    resize(); element.dataset.ready = 'true'
    return () => {
      observer.disconnect(); offRoll(); offTurn(); delete element.dataset.ready
      geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose())
      sun.shadow.dispose(); environment.dispose(); renderer.dispose()
    }
  }, [roll, turn])
  return <span className="pen-3d" ref={host}>
    <svg className="pen-3d-fallback" viewBox="354 49 431 1437" aria-hidden="true"><image href={assets.pen} width="1024" height="1536" /></svg>
    <canvas ref={canvas} aria-hidden="true" />
  </span>
}
