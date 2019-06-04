# node-red-contrib-interpolate

This node adds simple linear interpolation for cases where only a discrete set of data points for some quantity is provided/known but a value must be computed for any input

### Example

A set of temperatures at given heights above ground is known; from this data set we now want to estimate the temperature at _any_ height above ground.

## Use

The node needs two kinds of messages to perform interpolation:

* messages with topic **datagrid** define the grid of _x/y_ value pairs that serve as basis for the interpolation
* messages with the actual input data

### Data grid

The payload of **datagrid** messages must have the form:

```javascript
{
    x: [0.1, 0.2, 0.5, 1.0, 2.1, 10, 100],
    y: [23, 22.9, 22.7, 22.5, 22, 21, 19]
}
```

Here, **x** would be height and **y** would be the temperature from our example above.

### Input

The input for the actual interpolation must have the form

```javascript
{
    x: 42
}
```

which would, in our example above, calculate the temperature at a height of 42 meters.

## Configuration

The configuration of the node allows to select a specified context store for storing the data grid. See [https://nodered.org/docs/user-guide/context#context-stores](https://nodered.org/docs/user-guide/context#context-stores) for details on context stores.

## Limitations

* The node only performs _linear_ interpolation.
* The node only performs one-dimensional interpolation.
* The node only performs interpolation, not extrapolation. If one would e.g. calculate the temperature at a height of 200 meters in our example above, the node would just return the last available value of the grid (i.e. the temperature at 100 meters height.)

Note, however, that the data points don't have to be spaced equally (also compare the example above).
