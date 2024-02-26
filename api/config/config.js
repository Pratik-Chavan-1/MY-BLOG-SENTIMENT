// config.js
const torch = require('torch-js'); // Assuming you have a library for PyTorch-like functionality

const config = {
    IMG_SIZE: [224, 224],
    DEVICE: (torch.cuda.is_available() ? "cuda" : "cpu"),
    FOLDS: 5,
    SHUFFLE: true,
    BATCH_SIZE: 32,
    LR: 0.01,
    EPOCHS: 30,
    EMB_DIM: 100,
    MAX_LEN: 20,
    MODEL_PATH: "./Models/MyModel.pt"
};

module.exports = config;
