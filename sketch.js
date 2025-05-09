// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY, circleRadius = 100;
let isCircleGrabbed = false;

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
  fill(0, 0, 255, 100);
  noStroke();
  circle(circleX, circleY, circleRadius * 2);

  // 確保至少偵測到一隻手
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // 繪製手部的線條
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
        stroke(0, 255, 0); // 設定線條顏色
        strokeWeight(2);   // 設定線條粗細
        line(start.x, start.y, end.x, end.y); // 畫線
      }
    }
  }

  // 繪製每個關鍵點
  for (let i = 0; i < hand.keypoints.length; i++) {
    let keypoint = hand.keypoints[i];
    fill(255, 0, 0);
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
  } else {
    isCircleGrabbed = false;
  }

  // 如果抓住圓，讓圓跟隨手指移動
  if (isCircleGrabbed) {
    circleX = (indexFinger.x + thumb.x) / 2;
    circleY = (indexFinger.y + thumb.y) / 2;
  }
}
