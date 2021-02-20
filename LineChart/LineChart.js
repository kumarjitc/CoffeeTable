/****************************************************************
 ********************** Line Chart *****************************
 ****************************************************************/
 
 /**
  * Line Chart Object
  * Parameters:
		- JSON From Which Chart Will Be Drawn
  */
function LineChart (prm_data) {
	this._ctx;
	this._dataPointFont;
	this._dataPoints;
	this._dataPointsX;
	this._dataPointsY;
	this._elem;
	this._elemid;
	this._height = 0;
	this._width = 0;
	this._padding;
	this._xAxisLength = 0;
	this._yAxisLength = 0;
	this._yMax;
	this._yMin;
	this._yPointsCount;
	this._data;
	this._xAxisColor;
	this._xParallelLineColor;
	this._xPointColor;
	this._xTextColor;
	this._yAxisColor;
	this._yParallelLineColor;
	this._yPointColor;
	this._yTextColor;
	this._visibility;
	
	//Call Init To Draw
	this._init(prm_data);
}

//Static Variables Start
LineChart.c_s_KEY_ID = "id";
LineChart.c_s_KEY_HEIGHT = "height";
LineChart.c_s_KEY_WIDTH = "width";
LineChart.c_s_KEY_FONT_LABEL = "labelFont";
LineChart.c_s_KEY_FONT_DATAPOINT = "dataPointFont";
LineChart.c_s_KEY_DATAPOINT_X = "x";
LineChart.c_s_KEY_DATAPOINT_Y = "y";
LineChart.c_s_KEY_DATAPOINT_Y_VAL = "val";
LineChart.c_s_KEY_DATAPOINT_Y_COLOR = "color";
LineChart.c_s_KEY_COLORS_AXIS = "axisColors";
LineChart.c_s_KEY_COLOR_XAXIS = "xLineColor";
LineChart.c_s_KEY_COLOR_XPOINT = "xPointColor";
LineChart.c_s_KEY_COLOR_XPARALLEL = "xParallelLineColor";
LineChart.c_s_KEY_COLOR_XTEXT = "xTextColor";
LineChart.c_s_KEY_COLOR_YAXIS = "yLineColor";
LineChart.c_s_KEY_COLOR_YPOINT = "yPointColor";
LineChart.c_s_KEY_COLOR_YTEXT = "yTextColor";
LineChart.c_s_KEY_COLOR_YPARALLEL = "yParallelLineColor";
LineChart.c_s_KEY_VISIBILITY = "visibility";
LineChart.c_s_KEY_VISIBILITY_XAXIS = "xAxis";
LineChart.c_s_KEY_VISIBILITY_XPARALLEL = "xParallel";
LineChart.c_s_KEY_VISIBILITY_XPOINT = "xPoint";
LineChart.c_s_KEY_VISIBILITY_XTEXT = "xText";
LineChart.c_s_KEY_VISIBILITY_YAXIS = "yAxis";
LineChart.c_s_KEY_VISIBILITY_YPARALLEL = "yParallel";
LineChart.c_s_KEY_VISIBILITY_YPOINT = "yPoint";
LineChart.c_s_KEY_VISIBILITY_YTEXT = "yText";
LineChart.c_s_KEY_VISIBILITY_DATAVALUE = "dataValue";
LineChart.c_s_KEY_VISIBILITY_DATAPOINT = "dataPoint";
LineChart.c_s_KEY_VISIBILITY_DATAPOINTCONNECTOR = "dataPointConnector";

//Default Values
LineChart.c_s_PADDING = 40;
LineChart.c_s_DATAPOINT_Y_COLOR = "#808000";
LineChart.c_obj_AXIS_COLORS = {
						xLineColor : '#151B54',
						xPointColor : '#FF00FF',
						xTextColor : '#FF00FF',
						xParallelLineColor : '#AFC7C7',
						yLineColor : '#151B54',
						yPointColor : '#FF00FF',
						yTextColor : '#FF00FF',
						yParallelLineColor : '#AFC7C7'
					},
LineChart.c_obj_VISIBILITY = {
						xAxis: true,
						xParallel: true,
						xPoint: true,
						xText: true,
						yAxis: true,
						yParallel: true,
						yPoint: true,
						yText: true,
						dataValue: true,
						dataPoint: true,
						dataPointConnector: true
					};
//Static Variables End

//Member Methods Start
/**
 * function: _init
 * Objective:
	* Initializes Object For Drawing Chart
 */
LineChart.prototype._init = function (prm_data) {
	//Variable Declaration Block
	var _axisColors;
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within _init(): \n";
	
	//Exception Handling Block
	try {
		//Get JSON Data
		this._data = prm_data;
		
		//Get X Points
		this._dataPointsX = this._data[LineChart.c_s_KEY_DATAPOINT_X];
		
		//Validate Data And Execute Further Logic
		if (this.validateData()) {		
			//Get Canvas Element Id
			if (this._data.id != null) {
				//Get ELement Id
				this._elemid = this._data[LineChart.c_s_KEY_ID];
				//Get Element
				this._elem = document.getElementById(this._elemid);
				//Get Context
				this._ctx = this._elem.getContext("2d");
			} else {
				throw "Element Id Is Null; Cannot Populate Chart";
			}

			//Get Padding
			this._padding = LineChart.c_s_PADDING;
			
			//Get Height;
			if (this._data[LineChart.c_s_KEY_HEIGHT] != null) {
				this._height = this._data[LineChart.c_s_KEY_HEIGHT] * 1;
			} else {
				throw "Height Is Not Passed In The Parameters";
			}

			//Get Width
			if (this._data[LineChart.c_s_KEY_WIDTH] != null) {
				this._width = this._data[LineChart.c_s_KEY_WIDTH] * 1;
			} else {
				throw "Width Is Not Passed In The Parameters.";
			}
			/*
			 * Get Axes Length
			 * Leave 10px For Padding In Both Sides
			 */
			this._xAxisLength = this._width - this._padding;
			this._yAxisLength = this._height - this._padding;
									
			//Set Y Points Count
			this._yPointsCount = 5;
			
			//Get Limit Values For Y
			this.getLimitValues();
			
			/*
			 * If Axis Color Object Is Passed Set Values, Else Set To Default
			 * Do The Same For Each And Every ELement In Axis Colors Object, 
			   If Passed, Set To Passed Value
			   Else, Set To Default Value
			 */
			//Get Object
			if (this._data[LineChart.c_s_KEY_COLORS_AXIS] != null) {
				//Get Object From The Data Object
				_axisColors = this._data[LineChart.c_s_KEY_COLORS_AXIS];
			} else {
				//Get Object From Default
				_axisColors = LineChart.c_obj_AXIS_COLORS;
			}
			
			//Get Axis Colors
			//X Axis
			this._xAxisColor = _axisColors[LineChart.c_s_KEY_COLOR_XAXIS] != null ? _axisColors[LineChart.c_s_KEY_COLOR_XAXIS] : LineChart.c_obj_AXIS_COLORS[LineChart.c_s_KEY_COLOR_XAXIS];
			//X Axis Parallel
			this._xParallelLineColor = _axisColors[LineChart.c_s_KEY_COLOR_XPARALLEL] != null ? _axisColors[LineChart.c_s_KEY_COLOR_XPARALLEL] : LineChart.c_obj_AXIS_COLORS[LineChart.c_s_KEY_COLOR_XPARALLEL];
			//X Axis Points
			this._xPointColor = _axisColors[LineChart.c_s_KEY_COLOR_XPOINT] != null ? _axisColors[LineChart.c_s_KEY_COLOR_XPOINT] : LineChart.c_obj_AXIS_COLORS[LineChart.c_s_KEY_COLOR_XPOINT];
			//X Axis Texts
			this._xTextColor = _axisColors[LineChart.c_s_KEY_COLOR_XTEXT] != null ? _axisColors[LineChart.c_s_KEY_COLOR_XTEXT] : LineChart.c_obj_AXIS_COLORS[LineChart.c_s_KEY_COLOR_XTEXT];
			//Y Axis
			this._yAxisColor = _axisColors[LineChart.c_s_KEY_COLOR_YAXIS] != null ? _axisColors[LineChart.c_s_KEY_COLOR_YAXIS] : LineChart.c_obj_AXIS_COLORS[LineChart.c_s_KEY_COLOR_YAXIS];
			//Y Axis Parallel
			this._yParallelLineColor = _axisColors[LineChart.c_s_KEY_COLOR_YPARALLEL] != null ? _axisColors[LineChart.c_s_KEY_COLOR_YPARALLEL] : LineChart.c_obj_AXIS_COLORS[LineChart.c_s_KEY_COLOR_YPARALLEL];
			//Y Axis Points
			this._yPointColor = _axisColors[LineChart.c_s_KEY_COLOR_YPOINT] != null ? _axisColors[LineChart.c_s_KEY_COLOR_YPOINT] : LineChart.c_obj_AXIS_COLORS[LineChart.c_s_KEY_COLOR_YPOINT];
			//Y Axis Texts
			this._yTextColor = _axisColors[LineChart.c_s_KEY_COLOR_YTEXT] != null ? _axisColors[LineChart.c_s_KEY_COLOR_YTEXT] : LineChart.c_obj_AXIS_COLORS[LineChart.c_s_KEY_COLOR_YTEXT];
			
			
			//Get Visibility Object
			this._visibility = this._data[LineChart.c_s_KEY_VISIBILITY];
			//If Visibility Is Not Passed Set To Default
			if (this._visibility == null) {
				this._visibility = LineChart.c_obj_VISIBILITY;
			}
			
			//Call Draw
			this.draw();
		}
	} catch (_excp) {
		//Set Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/**
 * function: draw
 * Objective:
	* Draws Chart
	* Calls Functions To Render Components Based On The Initialized Value
 */
LineChart.prototype.draw = function () {
	//Exception Handling Block
	try {
		//Draw Background First
		this.drawBackground();
		//Draw Axes
		this.drawAxes();
		//Draw Axes Points
		this.drawAxesPoints();
		//Draw Chart Lines
		this.drawData();
	} catch (_excp) {
		alert("Within draw():\n" + _excp);
	}
	
}

/**
 * function: drawBackground
 * Objective:
	* Draws Chart Background
 */
LineChart.prototype.drawBackground = function () {
	var _bgGradient;

	//Exception Handling Block
	try {
		_bgGradient = this._ctx.createLinearGradient(0, 0, this._width, this._height);
        _bgGradient.addColorStop(0.0, '#D4D4D4');
        _bgGradient.addColorStop(0.2, '#FFFFFF');
        _bgGradient.addColorStop(0.8, '#FFFFFF');
        _bgGradient.addColorStop(1, '#D4D4D4');
        this._ctx.fillStyle = _bgGradient;
        this._ctx.fillRect(0, 0, this._width, this._height);
        this._ctx.fillStyle = 'black';
	} catch (_excp) {
		alert("Within draw():\n" + _excp);
	}
	
}

/**
 * function: drawAxes
 * Objective:
	* Draws Chart
	* Calls Functions To Render COmponents Based On The Initialized Value
 */
LineChart.prototype.drawAxes = function () {
	//Variable Declaration Block
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within drawAxes(): \n";
	
	//Exception Handling Block
	try {
		//Draw Axes
		//If X Axis Visibility Is Set true, Draw X Axis
		if (this._visibility[LineChart.c_s_KEY_VISIBILITY_XAXIS] || this._visibility[LineChart.c_s_KEY_VISIBILITY_XAXIS] == null) {
			//X Axis
			this.drawLine(this._padding, (this._yAxisLength + (this._padding/2)), this._xAxisLength, (this._yAxisLength + (this._padding/2)), this._xAxisColor);
		}
		//If Y Axis Visibility Is Set true, Draw Y Axis
		if (this._visibility[LineChart.c_s_KEY_VISIBILITY_YAXIS] || this._visibility[LineChart.c_s_KEY_VISIBILITY_YAXIS] == null) {
			//Y Axis
			this.drawLine(this._padding, this._padding/2, this._padding, (this._yAxisLength + (this._padding/2)), this._yAxisColor);
		}
	} catch (_excp) {
		//Set Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/**
 * function: drawAxesPoints
 * Objective:
	* Draws Chart
	* Calls Functions To Render COmponents Based On The Initialized Value
 */
LineChart.prototype.drawAxesPoints = function () {
	//Variable Declaration Block
	var _dataPoint;
	var _dataPointsCount;
	var _intervalXLength;
	var _intervalYLength;
	var _intervalYVal;
	var _pointX;
	var _pointY;
	var _valY;
	var _textPosX;
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within drawAxesPoints(): \n";
	
	//Exception Handling Block
	try {
		//Get Data Points Array
		_dataPointsCount = this._dataPointsX.length;
		
		//Get Point Interval Length
		_intervalXLength = this._xAxisLength/_dataPointsCount;
		_intervalYLength = this._yAxisLength/this._yPointsCount;
		_intervalYVal = this._yMax/this._yPointsCount;
		_pointX = this._padding;
		_pointY = this._yAxisLength;
		_valY = 0;
		
		//Render X Axis Points
		for (var _idx = 0; _idx < _dataPointsCount; _idx++) {
			//Get Object
			_dataPoint = this._dataPointsX[_idx];
			
			//Increase Point X Position
			if (_idx != 0) {
				//Get Next Points
				//X Point
				_pointX += _intervalXLength;
			}
			
			//Draw Point If Visibility Is Set To true or Null
			if (this._visibility[LineChart.c_s_KEY_VISIBILITY_XPOINT] || this._visibility[LineChart.c_s_KEY_VISIBILITY_XPOINT] == null) {
				//X Axis
				this.drawPoint(_pointX, (this._yAxisLength + (this._padding/2)), this._xPointColor);
			}
			
			//Draw Text If Visibility Is Set To true or Null
			if (this._visibility[LineChart.c_s_KEY_VISIBILITY_XTEXT] || this._visibility[LineChart.c_s_KEY_VISIBILITY_XTEXT] == null) {
				//X Axis Parallel
				this.drawText(_dataPoint, _pointX, this._yAxisLength + this._padding, this._xTextColor);
			}
			
			//Draw X Chart Line Each Point If Visibility Is Set To true or Null
			if (_idx != 0 && (this._visibility[LineChart.c_s_KEY_VISIBILITY_YPARALLEL] || this._visibility[LineChart.c_s_KEY_VISIBILITY_YPARALLEL] == null)) {
				this.drawLine(_pointX, this._padding/2, _pointX, (this._yAxisLength + (this._padding/2)), this._xParallelLineColor, 1);
			}
		}
		
		//Render Y Axis Points
		for (var _idx = 0; _idx <= this._yPointsCount; _idx++) {
			//Increase Point Y Position
			if (_idx != 0) {
				//Get Next Points
				//Y Point
				_pointY -= _intervalYLength;
				//Y Val
				_valY += _intervalYVal;
			}
			
			//Draw Point If Visibility Is Set To true or Null
			if (this._visibility[LineChart.c_s_KEY_VISIBILITY_YPOINT] || this._visibility[LineChart.c_s_KEY_VISIBILITY_YPOINT] == null) {
				//Y Axis
				this.drawPoint(this._padding, (_pointY + (this._padding/2)), this._xPointColor);
			}
			
			//Calculate Text Position For Y
			if (this._ctx.measureText(_valY).width > 12) {
				_textPosX = 15;
			} else if (this._ctx.measureText(_valY).width > 6) {
				_textPosX = 18;
			} else {
				_textPosX = 20;
			} 
			
			//Draw Text If Visibility Is Set To true or Null
			if (this._visibility[LineChart.c_s_KEY_VISIBILITY_YTEXT] || this._visibility[LineChart.c_s_KEY_VISIBILITY_YTEXT] == null) {
				//Y Axis Parallel
				this.drawText(_valY, _textPosX, (_pointY + (this._padding/2)), this._yTextColor);
			}
			
			//Draw Y Chart Line Each Point If Visibility Is Set To true or Null
			if (_idx != 0 && (this._visibility[LineChart.c_s_KEY_VISIBILITY_XPARALLEL] || this._visibility[LineChart.c_s_KEY_VISIBILITY_YPARALLEL] == null)) {
				//Draw Graph Lines
				this.drawLine(this._padding, (_pointY + (this._padding/2)), this._xAxisLength, (_pointY + (this._padding/2)), this._yParallelLineColor, 1);
			}
		}
	} catch (_excp) {
		//Set Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/**
 * function: drawData
 * Objective:
	* Darw Data From X And Y
 */
LineChart.prototype.drawData = function () {
	//Variable Handling Block
	var _dataPoint;
	var _dataPointX;
	var _dataPointsX;
	var _dataPointY;
	var _dataPointsY;
	var _dataPointYList;
	var _lineColor;
	var _prevX;
	var _prevY;
	var _intervalXLength;
	var _unit;
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within drawChartLines(): \n";

	//Exception Handling Block
	try {
		//Set Variables
		_intervalXLength = this._xAxisLength/this._dataPointsX.length;
		
		_unit = this._yAxisLength/this._yMax;
	
		//Get Data Point Y List
		_dataPointYList = this._data[LineChart.c_s_KEY_DATAPOINT_Y];
		//Get Data Point For X
		_dataPointsX = this._data[LineChart.c_s_KEY_DATAPOINT_X];
		
		//Traverse Through The List
		for (var _key in _dataPointYList) {
			//Get Data Points
			_dataPointsY = _dataPointYList[_key][LineChart.c_s_KEY_DATAPOINT_Y_VAL];
			//Get Line Color
			_lineColor = _dataPointYList[_key][LineChart.c_s_KEY_DATAPOINT_Y_COLOR] != null ? _dataPointYList[_key][LineChart.c_s_KEY_DATAPOINT_Y_COLOR] : LineChart.c_s_DATAPOINT_Y_COLOR;
			
			_prevX = 0;
			_prevY = 0;
			_dataPointX = this._padding;
						
			//Traverse Through The List
			for (var _idx = 0; _idx < _dataPointsY.length; _idx++) {
				//Get Data Point At This Index
				_dataPoint = _dataPointsY[_idx];
				
				//Add Interval Length If Index Is Not At 0
				if (_idx != 0) {
					//Get Next X Point
					_dataPointX += _intervalXLength;
				}
				
				//Get Next Y Point
				_dataPointY = (this._yAxisLength + (this._padding/2)) - (_dataPoint * _unit);
				
				//Draw Data Point If Visibility Is Set To True
				if (this._visibility[LineChart.c_s_KEY_VISIBILITY_DATAPOINT] || this._visibility[LineChart.c_s_KEY_VISIBILITY_DATAPOINT] == null) {
					//Draw Point
					this.drawPoint(_dataPointX, _dataPointY, _lineColor);
				}
				
				//Draw Line If Index Is Not 0 And Visibility Is Set To true 
				if (_idx != 0 && (this._visibility[LineChart.c_s_KEY_VISIBILITY_DATAPOINTCONNECTOR] || this._visibility[LineChart.c_s_KEY_VISIBILITY_DATAPOINTCONNECTOR] == null)) {
					this.drawLine(_prevX, _prevY, _dataPointX, _dataPointY, _lineColor);
				}
				
				//Draw Value If Visibility Is set To true
				if (this._visibility[LineChart.c_s_KEY_VISIBILITY_DATAVALUE] || this._visibility[LineChart.c_s_KEY_VISIBILITY_DATAVALUE] == null) {
					//Draw Text
					this.drawText(_dataPoint, _dataPointX + 10, _dataPointY + 10, _lineColor);
				}
				
				//Set Previous Values For Line Drawing
				_prevX = _dataPointX;
				_prevY = _dataPointY;
			}
		}
	} catch (_excp) {
		//Set Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/**
 * function: drawLine
 * Objective:
	* Darw Lines
 */
LineChart.prototype.drawLine = function (prm_startX, prm_startY, prm_endX, prm_endY, prm_strokeStyle, prm_lineWidth) {
	//Variable Handling Block
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within drawLine(): \n";

	//Exception Handling Block
	try {
		//Get Line Width If _lineWidth Is Passed
		if (prm_lineWidth != null) {
			this._ctx.lineWidth = prm_lineWidth;
		}
		
		//Get Stroke Style If Stroke Style Is Passed
		if (prm_strokeStyle != null) {
			this._ctx.strokeStyle = prm_strokeStyle;
		}
		
		//Draw Line With Canvas APIs
		this._ctx.beginPath();
		this._ctx.moveTo(prm_startX, prm_startY);
		this._ctx.lineTo(prm_endX, prm_endY);
		this._ctx.stroke();
		this._ctx.closePath();
	} catch (_excp) {
		//Set Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/**
 * function: drawPoint
 * Objective:
	* Darw Points For Values
 */
LineChart.prototype.drawPoint = function (prm_centerX, prm_centerY, prm_fillColor) {
	//Variable Declaration Block//Variable Handling Block
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within drawPoint(): \n";
	
	//Exception Handling Block
	try {
		//Draw Point
		this._ctx.fillStyle = prm_fillColor;
		this._ctx.beginPath();
		this._ctx.arc(prm_centerX, prm_centerY, 2, 0, 2 * Math.PI, false);
		this._ctx.stroke();
		this._ctx.fill();
		this._ctx.beginPath();
	} catch (_excp) {
		//Set Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/**
 * function: drawText
 * Objective:
	* Darw Texts For Values
 */
LineChart.prototype.drawText = function (prm_text, prm_posX, prm_posY, prm_fillColor) {
	//Variable Declaration Block
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within drawText(): \n";
	
	//Exception Handling Block
	try {
		//Draw Text
		if (prm_fillColor != null) {
			this._ctx.fillStyle = prm_fillColor;
		}
		this._ctx.font="small Verdana bold";
		this._ctx.fillText(prm_text, prm_posX, prm_posY);
	} catch (_excp) {
		//Set Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/**
 * function: getLimitValues
 * Objective:
	* Get Limit Value From The Object For Plotting Graph
 */
LineChart.prototype.getLimitValues = function () {
	//Variable Declaration Block
	var _dataPoint;
	var _dataPoints;
	var _tempMax;
	var _tempMin;
	var _excpMsg;
	
	//Variable Initialization Block
	_tempMax = 0;
	_tempMin = 0;
	_excpMsg = "Within getLimitValues():\n";
	
	//Exception Handling Block
	try {
		//Get Data Points
		_dataPoints = this._data[LineChart.c_s_KEY_DATAPOINT_Y];
		
		//Traverse Through The Datapoints
		for (var _key in _dataPoints) {
			//Traverse Through Values In Each Key
			_dataPoint = _dataPoints[_key];
			
			//Taverse Through All The Values
			for (var _idx = 0; _idx < _dataPoint[LineChart.c_s_KEY_DATAPOINT_Y_VAL].length; _idx++) {
				//Get Max And Min Limits
				//Max Limit
				if (_dataPoint[LineChart.c_s_KEY_DATAPOINT_Y_VAL][_idx] > _tempMax) {
					_tempMax = _dataPoint[LineChart.c_s_KEY_DATAPOINT_Y_VAL][_idx];
				}
				//Min Limit
				//Initialize _tempMin If Not Already Set i.e. Set To 0
				if (_dataPoint[LineChart.c_s_KEY_DATAPOINT_Y_VAL][_idx] < _tempMin) {
					_tempMin = _dataPoint[LineChart.c_s_KEY_DATAPOINT_Y_VAL][_idx];				
				} else if (_tempMin == 0) {
					_tempMin = _dataPoint[LineChart.c_s_KEY_DATAPOINT_Y_VAL][_idx];
				}
			}
		}
		
		//Round Of To Nearest Integers
		_tempMax = Math.ceil(_tempMax);
		_tempMin = Math.ceil(_tempMin);
		
		/*
		 * If Y Max Is Not A Multiple Of Y Points Count,
		 * Find The Nearest Integer Which Is A Multiple of Y Points Count
		 */
		if ((_tempMax%this._yPointsCount) != 0) {
			_tempMax += (this._yPointsCount - (_tempMax%this._yPointsCount));
		}
		
		//Set To Member Variables
		this._yMax = _tempMax;
		this._yMin = _tempMin;
	} catch (_excp) {
		//Set Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/**
 * function: validateData
 * Objective:
	- Validates If data Is In Correct Format Regarding:
		- X, Y Matrix Is In Complete Format
 */
LineChart.prototype.validateData = function () {
	//Variable Declaration Block
	var _xLength;
	var _yPointsList;
	var _return;
	var _excpMsg;
	
	//Variable Initialization Block
	_return = true;
	_excpMsg = "Within validateData():\n"
	
	//Exception Handling Block
	try {
		//Get X Length
		_xLength = this._dataPointsX.length;
		
		//Get Y Points List
		_yPointsList = this._data[LineChart.c_s_KEY_DATAPOINT_Y];
		
		//Traverse Through Y Points And Verify Data
		for (var _key in _yPointsList) {
			//If Y Points Array Length Is Greater Than  X Points Length, Throw Exception And Break
			if (_yPointsList[_key][LineChart.c_s_KEY_DATAPOINT_Y_VAL].length > _xLength) {
				//Set Flag To False
				_return = false;
				//Throw Exception
				throw "Invalid Data Format";
				//Break Out Of Loop
				break;
			}
		}
	} catch (_excp) {
		//Set Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
	
	//Return Statement
	return _return;
}
//Member Methods Ends