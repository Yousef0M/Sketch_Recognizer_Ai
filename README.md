# BetterThanQuickDraw
Artificial intelligence is used in the project to predict what you are drawing. An implementation of the Convolutional Neural Network in Javascript. It takes an image and predicts a number that represents a guess at what the image looks like.

The network was trained on 150 different concepts from Quick Draw Data using Python with the TensorFlow library, and the network was implemented in Javascript using TensorFlow.

![alt text](https://github.com/Yousef0M/BetterThanQuickDraw/blob/main/Examble.png)

The image above shows some of the preprocessed data.



The network has 28x28 image input [grayscaled and thresholded image, two values in the image 0=black, 1=white].

The recognition error on the test data set is 11% and the accuracy is 72.5%.



The project was created by Yousef Mahmood, and my sole purpose was to have fun. It was hugely inspired by the game Quick Draw.
