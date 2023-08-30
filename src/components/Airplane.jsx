import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Airplane(props) {
  const { nodes, materials } = useGLTF('./models/airplane/paper_plane.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Object_4.geometry} material={materials
     ['Scene_-_Root']} rotation={[Math.PI / 2.07, 4.6, 1.5]} />  
    </group>
  )
}

useGLTF.preload('./models/airplane/paper_plane.glb')
