import {
  Float,
  OrbitControls,
  Cloud,
  Line,
  PerspectiveCamera,
  useScroll,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Background } from "./Background";
import { Airplane } from "./Airplane";
import { useMemo, useRef } from "react";
import * as THREE from "three";
// import { Cloud } from "./Cloud";

const LINE_NB_POINTS = 11000;

export const Experience = () => {
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0.3, 0, 0),
        new THREE.Vector3(0, 0, -10),
        new THREE.Vector3(-2, 0, -20),
        new THREE.Vector3(-3, 0, -30),
        new THREE.Vector3(0, 0, -40),
        new THREE.Vector3(0, 0, -50),
        new THREE.Vector3(6, 0, -60),
        new THREE.Vector3(7, 0, -70),
        new THREE.Vector3(3, 0, -80),
        new THREE.Vector3(5, 0, -90),
        new THREE.Vector3(2, 0, -100),
      ],
      false,
      "catmullrom",
      0.5
    );
  }, []);

  const linePoints = useMemo(() => {
    return curve.getPoints(LINE_NB_POINTS);
  }, [curve]);

  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.2);
    shape.lineTo(0, -0.3);
    return shape;
  }, [curve]);

  const cameraGroup = useRef();
  const scroll = useScroll();

  useFrame((_state, delta) => {
    const curPointIndex = Math.min(
      Math.round(scroll.offset * linePoints.length),
      // Math.round(scroll.offset / scroll.pages * LINE_NB_POINTS),
      linePoints.length - 1
    );
    const curPoint = linePoints[curPointIndex];
    const pointHead =
      linePoints[Math.min(curPointIndex + 1, linePoints.length - 1)];

    const xDisplacement = (pointHead.x - curPoint.x) * 80;

    const angleRotation =
      (xDisplacement < 0 ? 1 : -1) *
      Math.min(Math.abs(xDisplacement), Math.PI / 3);
    // const angleRotation = (xDisplacement < 0 ? 1 : -1) * Math.min(Math.abs(xDisplacement), Math.PI / 3) + Math.atan((pointHead.z - curPoint.z) / xDisplacement)
    // const angleRotation = (xDisplacement < 0 ? 1 : -1) * Math.PI / 2 + Math.atan((pointHead.z - curPoint.z) / xDisplacement)
    const targetAirplaneQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        airplane.current.rotation.x,
        airplane.current.rotation.y,
        angleRotation
      )
    );

    const targetCameraQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        cameraGroup.current.rotation.x,
         angleRotation,
        cameraGroup.current.rotation.z,
       
      )
    );
    airplane.current.quaternion.slerp(targetAirplaneQuaternion, delta * 2);
    cameraGroup.current.quaternion.slerp(targetCameraQuaternion, delta * 2);

    cameraGroup.current.position.lerp(curPoint, delta * 24);
  });

  const airplane = useRef();

  return (
    <>
      {/* <OrbitControls enableZoom={false} /> */}
      <group ref={cameraGroup}>
        <Background />
        <PerspectiveCamera position={[0, 0, 5]} fov={30} makeDefault />
        <group ref={airplane}>
          <Float floatIntensity={2} speed={2}>
            <Airplane
              rotation-y={Math.PI / -2}
              scale={[0.4, 0.4, 0.4]}
              position={0.2}
            />
          </Float>
        </group>
      </group>
      {/* Line */}
      <group position-y={[-2]}>
        <mesh>
          <extrudeGeometry
            args={[
              shape,
              {
                steps: LINE_NB_POINTS,
                bevelEnabled: false,
                extrudePath: curve,
              },
            ]}
          >
            <meshStandardMaterial color={"white"} opacity={0.7} transparent />
          </extrudeGeometry>
        </mesh>
      </group>

      <Cloud opacity={0.5} scale={[0.3, 0.3, 0.3]} position={[-9, 19, -23]} />
      <Cloud
        opacity={0.2}
        scale={[0.3, 0.3, 0.4]}
        position={[-2.5, 3.3, -12]}
      />
      <Cloud opacity={0.2} scale={[0.4, 0.6, 0.3]} position={[8, 2, -3]} />
      <Cloud opacity={0.2} scale={[0.5, 0.6, 0.3]} position={[-9, 6, -9]} />
      <Cloud opacity={0.7} scale={[0.5, 0.3, 0.3]} position={[20, 0.4, -53]} />
      <Cloud opacity={0.2} scale={[0.4, 0.4, 0.3]} position={[10, 3, -100]} />
      <Cloud opacity={0.4} scale={[0.6, 0.6, 0.3]} position={[-10, 8, -110]} />
    </>
  );
};
