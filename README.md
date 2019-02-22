This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

This project is deployed on http://dseparation-bayes.herokuapp.com

# Overview
The purpose of this web app is to provide an interface to simulate d-separation in Bayesian Networks.
(https://www.andrew.cmu.edu/user/scheines/tutor/d-sep.html) The app should allow users to create directed
graphs (baye's nets) and mark which nodes are in which set (X, Y, E) to find d-separated paths in that graph. 
The displayed results display whether P(X, Y | E) = P(X| E) * P(Y | E), that is, is the sets X and Y conditionally
independent given the set E.

# Instructions
When you first open the app, there are buttons at the top of the page to change the modes of the app and to generate
the resulting paths.
You can add nodes to the canvas by clicking on the canvas. 
Nodes can be dragged around the canvas.

(Note: since the web app is deployed on heroku, it'll fall asleep after awhile
of no activity, therefore if its the first time visiting the web app then it may
not load the first. In that case, refresh the page and try again.)

## Modes:
There are 3 modes for building the graph. 
The first mode is for marking which the nodes are in which set. You can switch between which set is marking the nodes. Mark nodes by clicking on them while on the first mode. You can also change which set each node is in by clicking on
the auto generated table of nodes.
The second mode is for adding edges between nodes. Click on a first node to select it in which it will be highlighted
orange. Then click on a second node to add an edge between the first selected node and the second node. You can click
on the first node to deselect it.
The third mode is for deleting nodes and edges. Click on a node or edge and it will delete the node or edge.

Click on the button below the modes to generate all d-separated paths from X to Y given E. You can click the paths 
and the graph will highlight red the path you selected.


Created as a mini project for the class CSE150 at UCSD by Nathaniel Lee and Nishil Macwan.
