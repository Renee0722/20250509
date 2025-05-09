// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY, circleRadius = 100;
let isCircleGrabbed = false;
let previousCircleX = null;
let previousCircleY = null;
let trails = []; // 用於存儲軌跡的陣列

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function setup() {
  createCanvas(640, 480); // 產生畫布
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);

  // 初始化圓的位置
  circleX = width / 2;
  circleY = height / 2;
}

function gotHands(results) {
  hands = results;
}

function draw() {
  image(video, 0, 0); // 顯示相機畫面

  // 繪製圓
  if (!isCircleGrabbed) {
    fill(0, 0, 255, 100); // 預設圓的顏色為藍色
  }
  noStroke();
  circle(circleX, circleY, circleRadius * 2);

  // 繪製軌跡
  drawTrails();

  // 確保至少偵測到一隻手
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // 繪製手部的線條和圓點
        drawHandLines(hand);

        // 檢查是否抓住圓
        checkCircleGrab(hand);
      }
    }
  }
}

function drawHandLines(hand) {
  // 定義分組範圍
  let groups = [
    [0, 1, 2, 3, 4],   // 編號 0 到 4
    [5, 6, 7, 8],      // 編號 5 到 8
    [9, 10, 11, 12],   // 編號 9 到 12
    [13, 14, 15, 16],  // 編號 13 到 16
    [17, 18, 19, 20]   // 編號 17 到 20
  ];

  // 遍歷每個分組，畫出線條
  for (let group of groups) {
    for (let i = 0; i < group.length - 1; i++) {
      let start = hand.keypoints[group[i]];
      let end = hand.keypoints[group[i + 1]];

      if (start && end) {
        stroke(0, 255, 0); // 線條顏色為綠色
        strokeWeight(2);   // 設定線條粗細
        line(start.x, start.y, end.x, end.y); // 畫線
      }
    }
  }

  // 繪製每個關鍵點
  for (let i = 0; i < hand.keypoints.length; i++) {
    let keypoint = hand.keypoints[i];

    // 根據左右手設定圓圈顏色
    if (hand.handedness === "Left") {
      fill(255, 0, 255); // 左手圓圈顏色為粉紅色
    } else if (hand.handedness === "Right") {
      fill(255, 255, 0); // 右手圓圈顏色為黃色
    }

    noStroke();
    circle(keypoint.x, keypoint.y, 10); // 繪製圓點
  }
}

function checkCircleGrab(hand) {
  let indexFinger = hand.keypoints[8]; // 食指
  let thumb = hand.keypoints[4]; // 大拇指

  // 計算食指和大拇指是否同時觸碰圓的邊緣
  let indexDist = dist(indexFinger.x, indexFinger.y, circleX, circleY);
  let thumbDist = dist(thumb.x, thumb.y, circleX, circleY);

  if (indexDist < circleRadius && thumbDist < circleRadius) {
    isCircleGrabbed = true;

    // 如果抓住圓，讓圓跟隨手指移動
    circleX = (indexFinger.x + thumb.x) / 2;
    circleY = (indexFinger.y + thumb.y) / 2;

    // 根據左右手改變大圓顏色
    if (hand.handedness === "Left") {
      fill(0, 255, 0, 100); // 左手：綠色
    } else if (hand.handedness === "Right") {
      fill(255, 0, 0, 100); // 右手：紅色
    }

    // 畫出圓心的軌跡
    if (previousCircleX !== null && previousCircleY !== null) {
      let color = hand.handedness === "Left" ? [0, 255, 0] : [255, 0, 0]; // 左手綠色，右手紅色
      trails.push({
        x1: previousCircleX,
        y1: previousCircleY,
        x2: circleX,
        y2: circleY,
        color: color
      });
    }

    // 更新上一個圓心位置
    previousCircleX = circleX;
    previousCircleY = circleY;
  } else {
    isCircleGrabbed = false;

    // 如果手指離開圓，停止更新上一個位置
    previousCircleX = null;
    previousCircleY = null;
  }
}

function drawTrails() {
  for (let trail of trails) {
    stroke(trail.color[0], trail.color[1], trail.color[2]); // 設定軌跡顏色
    strokeWeight(10); // 設定線條粗細為 10
    line(trail.x1, trail.y1, trail.x2, trail.y2); // 畫出軌跡
  }
}
