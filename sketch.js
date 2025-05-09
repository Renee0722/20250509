// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function setup() {
  createCanvas(800, 600); // 建立畫布
  video = createCapture(VIDEO); // 啟用相機
  video.size(800, 600);
  video.hide(); // 隱藏原始相機畫面

  // 啟用 HandPose 並設定回呼函式
  handPose.on("predict", gotHands);
}

function gotHands(results) {
  hands = results; // 更新偵測到的手部資料
}

function draw() {
  // 顯示相機畫面
  image(video, 0, 0); 

  // 確保至少偵測到一隻手
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // 繪製手部的線條
        drawHandLines(hand);
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
      let start = hand.annotations[group[i]];
      let end = hand.annotations[group[i + 1]];

      if (start && end) {
        stroke(0, 255, 0); // 設定線條顏色
        strokeWeight(2);   // 設定線條粗細
        line(start[0][0], start[0][1], end[0][0], end[0][1]); // 畫線
      }
    }
  }

  // 繪製每個關鍵點
  for (let i = 0; i < hand.landmarks.length; i++) {
    let keypoint = hand.landmarks[i];
    fill(255, 0, 0); // 設定點的顏色
    noStroke();
    circle(keypoint[0], keypoint[1], 10); // 繪製圓點
  }
}
