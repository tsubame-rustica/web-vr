// threejs
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { StereoEffect } from 'three/examples/jsm/effects/StereoEffect.js';

const showEndOuter = document.getElementById('end');

showEndOuter.style.display = "none";


// ローディング中の進捗バー用
const progressOuter = document.getElementById('showProgressBar');
const progress = document.getElementById('progress');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
const light = new THREE.DirectionalLight(0xffffff, 1.0);
const renderer = new THREE.WebGLRenderer();

scene.add(light);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

const effect = new StereoEffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);


// カメラの位置と角度を設定する変数
const pos = camera.position;
const rote = camera.rotation;
const pi = Math.PI;

pos.x = 0;
pos.y = 0;
pos.z = 0;
rote.y = pi / -2;


// 基準となるスピードと角度
const defaultSpeed = 0.25;
const defaultDeg = pi / 180 * defaultSpeed;

// アニメーションのステップを管理する変数
let step = 0;
// 上下の移動を切り替える関数
let upDownStep = 0;

// スカイボックス（ワールドの背景）の設定
const loaderSkyBox = new THREE.CubeTextureLoader();
const texture = loaderSkyBox.load([
    '/skybox/CosmicCoolCloudLeft.png',
    '/skybox/CosmicCoolCloudRight.png',
    '/skybox/CosmicCoolCloudTop.png',
    '/skybox/CosmicCoolCloudBottom.png',
    '/skybox/CosmicCoolCloudFront.png',
    '/skybox/CosmicCoolCloudBack.png',
]);
scene.background = texture;


// 霧の追加
scene.fog = new THREE.Fog(0x000000, 50, 2000);

// GLTFローダーを読み込み
const loaderGLTF = new GLTFLoader();
loadField(loaderGLTF);


// 機体（仮想）の向き
let roteY = 0;

// アニメーションを実行する関数
function animate() {
    requestAnimationFrame(animate);

    // stepを管理する変数
    if (pos.x >= 100 && step == 0) {
        step = 1;
    } else if (roteY >= pi / 4 && step == 1) {
        step = 2;
    } else if (pos.x >= 200 && step == 2) {
        step = 3;
    } else if (roteY <= -1 * pi && step == 3) {
        step = 4;
    } else if (pos.x <= 200 && step == 4) {
        step = 5;
    } else if (roteY >= 0 && step == 5) {
        step = 6;
    } else if (roteY >= pi * 25 / 180 && step == 6) {
        step = 7;
    } else if (pos.x >= 400 && step == 7) {
        step = 8;
    } else if (pos.x >= 600 && step == 8) {
        step = 9;
    } else if (roteY <= -1 * pi && step == 9) {
        step = 10;
    } else if (pos.x <= 600 && step == 10) {
        step = 11;
    } else if (roteY >= 0 && step == 11) {
        step = 12;
    } else if (roteY >= pi / 6 && step == 12) {
        step = 13;
    } else if (pos.x >= 800 && step == 13) {
        showEndOuter.style.display = "block";
        return;
    }

    // カメラの角度を調整する
    if (step == 0) {
        rote.y = roteY - pi / 2;
    } else if (step == 1) {        // 45degまで右旋回
        roteY = roteY + defaultDeg;
        rote.y = roteY - pi / 2;
    } else if (step == 2) {
        rote.y = roteY - pi / 2;
    } else if (step == 3) {
        roteY = roteY - defaultDeg;
        rote.y = roteY - pi / 2;
        if (pos.y < 10) {
            rote.x += defaultDeg;
            pos.y += defaultSpeed;
        }
    } else if (step == 4) {
        rote.y += defaultDeg * 2.8;
        if (pos.y > 0) {
            rote.x -= defaultDeg;
            pos.y -= defaultSpeed;
        }
    } else if (step == 5) {
        roteY = roteY + defaultDeg;
        rote.y = roteY + pi / 6;
    } else if (step == 6) {
        roteY = roteY + defaultDeg;
        rote.y -= defaultDeg * 3.5;
        if (rote.y >= pi * 2 / 3) {
            rote.y = pi * 2 / 3;
        }
    } else if (step == 8) {
        if (upDownStep == 0) {
            pos.y += defaultSpeed
        } else if (upDownStep == 1) {
            pos.y -= defaultSpeed
        }
        if (pos.y >= 15 && upDownStep == 0) {
            upDownStep = 1;
        } else if (pos.y < 0 && upDownStep == 1) {
            upDownStep = 2;
            pos.y = 0;
        }
    } else if (step == 9) {
        roteY = roteY - defaultDeg;
        rote.y = roteY - pi / 2;
    } else if (step == 10) {
        rote.y += defaultDeg * 5;
    } else if (step == 11) {
        roteY = roteY + defaultDeg;
        rote.y = roteY + pi / 6;
    } else if (step == 12) {
        roteY = roteY + defaultDeg;
        rote.y -= defaultDeg * 3.5;
        if (rote.y >= pi * 2 / 3) {
            rote.y = pi * 2 / 3;
        }
    }
    
    // どれだけ進むかを三角関数で計算
    pos.x = pos.x + defaultSpeed * Math.cos(roteY);
    pos.z = pos.z - defaultSpeed * Math.sin(roteY);

    effect.render(scene, camera);
}


window.addEventListener('resize', onWindowResize, false);

// スクリーンをリサイズする関数
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  effect.setSize(window.innerWidth, window.innerHeight);
}

// glbファイルを読み込む関数
function loadField(loaderGLTF) {
    loaderGLTF.load(
        `${import.meta.env.BASE_URL}stage.glb`,
        function ( gltf ) {

            // ワールドをthreejsに表示
            scene.add( gltf.scene );

            gltf.animations;
            gltf.scene;
            gltf.scenes;
            gltf.cameras;
            gltf.asset;

        },
        // called while loading is progressing
        function ( xhr ) {
            //　進捗バーをWebに表示
            progress.style.width = ( xhr.loaded / xhr.total * 100 ) + '%';
            if (xhr.loaded / xhr.total * 100 >= 100) {
                progressOuter.style.display = "none";
                animate();  // glbファイルのロードが終わったらアニメーションを開始
            }
        }
    );
}