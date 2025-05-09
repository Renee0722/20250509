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
  createCanvas(800, 600); // 建立畫布
  background(220);

  // 假設 hand.keypoints 是一個包含 21 個點的陣列，每個點是 {x, y}
  let hand = {
    keypoints: [
      { x: 50, y: 50 }, { x: 100, y: 100 }, { x: 150, y: 150 }, { x: 200, y: 200 }, { x: 250, y: 250 }, // 0-4
      { x: 300, y: 50 }, { x: 350, y: 100 }, { x: 400, y: 150 }, { x: 450, y: 200 },                   // 5-8
      { x: 500, y: 50 }, { x: 550, y: 100 }, { x: 600, y: 150 }, { x: 650, y: 200 },                   // 9-12
      { x: 700, y: 50 }, { x: 750, y: 100 }, { x: 800, y: 150 }, { x: 850, y: 200 },                   // 13-16
      { x: 900, y: 50 }, { x: 950, y: 100 }, { x: 1000, y: 150 }, { x: 1050, y: 200 }                  // 17-20
    ]
  };

  // 繪製手部的線條
  drawHandLines(hand);
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
      line(start.x, start.y, end.x, end.y); // 使用 p5.js 的 line 函式
    }
  }
}

function draw() {
  image(video, 0, 0);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Loop through keypoints and draw circles
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }
      }
    }
  }
}
