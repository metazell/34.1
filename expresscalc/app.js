const express = require('express');
const fs = require('fs');
const app = express();

// Utility functions
function calculateMean(nums) {
  let sum = nums.reduce((acc, cur) => acc + cur, 0);
  return sum / nums.length;
}

function calculateMedian(nums) {
  nums.sort((a, b) => a - b);
  const mid = Math.floor(nums.length / 2);

  return nums.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
}

function calculateMode(nums) {
  let freq = {};
  let maxFreq = 0;
  let modes = [];

  nums.forEach(num => {
    freq[num] = (freq[num] || 0) + 1;

    if (freq[num] > maxFreq) {
      maxFreq = freq[num];
      modes = [num];
    } else if (freq[num] === maxFreq) {
      modes.push(num);
    }
  });

  return modes.length === nums.length ? null : modes;
}

function validateNums(numsStr) {
  if (!numsStr) throw new Error("nums are required.");
  let nums = numsStr.split(',').map(n => {
    let parsed = parseFloat(n);
    if (isNaN(parsed)) throw new Error(`${n} is not a number.`);
    return parsed;
  });
  return nums;
}

function handleResponse(req, res, operation, value) {
  if (req.headers.accept === 'text/html') {
    res.send(`<h1>${operation}</h1><p>${operation}: ${value}</p>`);
  } else {
    res.json({ operation, value });
  }
}

function saveResult(operation, value) {
  const timestamp = new Date().toISOString();
  const result = {
    timestamp,
    operation,
    value
  };
  fs.writeFileSync('results.json', JSON.stringify(result, null, 2));
}

// Routes
app.get('/mean', (req, res, next) => {
  try {
    let nums = validateNums(req.query.nums);
    let mean = calculateMean(nums);
    handleResponse(req, res, "mean", mean);

    if (req.query.save === "true") {
      saveResult("mean", mean);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/median', (req, res, next) => {
  try {
    let nums = validateNums(req.query.nums);
    let median = calculateMedian(nums);
    handleResponse(req, res, "median", median);

    if (req.query.save === "true") {
      saveResult("median", median);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/mode', (req, res, next) => {
  try {
    let nums = validateNums(req.query.nums);
    let mode = calculateMode(nums);
    handleResponse(req, res, "mode", mode);

    if (req.query.save === "true") {
      saveResult("mode", mode);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/all', (req, res, next) => {
  try {
    let nums = validateNums(req.query.nums);
    let mean = calculateMean(nums);
    let median = calculateMedian(nums);
    let mode = calculateMode(nums);

    const result = { operation: "all", mean, median, mode };
    
    if (req.query.save === "true") {
      saveResult("all", result);
    }

    handleResponse(req, res, "all", result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('App is running on http://localhost:3000');
});

module.exports = app;
