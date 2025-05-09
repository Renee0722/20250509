// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480); //產生一個畫布
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0); // 顯示相機畫面

  // 確保至少偵測到一隻手
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // 繪製手部的線條
        drawHandLines(hand);

        // 繪製每個關鍵點
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // 根據左右手設定顏色
          if (hand.handedness == "Left") {
            fill(255, 0, 255); // 左手顏色
          } else {
            fill(255, 255, 0); // 右手顏色
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16); // 繪製圓點
        }
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
}
