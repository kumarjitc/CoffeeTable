/**
 * MeterChart.js
 * date 20130130
 * objective:
 	- Draws Charts
 	- Contains Object For Different Chart Types
 */

/****************************************************************
 ********************** Chart Constants *************************
 ****************************************************************/
/**
 * Chart Constants Object
 */
function ChartConstant () {}

//Static Object Properties
ChartConstant.c_s_FILL_STYLE_PATTERN = "pattern";
ChartConstant.c_s_FILL_STYLE_SINGLE_COLOR = "plain";
ChartConstant.c_s_FILL_STYLE_GRADIENT = "gradient";
//Chart Constant Object Ends


/****************************************************************
 ********************** Meter Chart *****************************
 ****************************************************************/
/**
 * Meter Chart Object
 * Parameters:
 	- JSON From Which Chart Needs To Be Drawn
 */
function MeterChart (prm_dataObject) {
	this.g_animate = true;
	this.g_data;
	this.g_fillImage;
	this.g_fillStyle;
	this.g_increment = 0;
	this.g_interval = 0;
	this.g_object = prm_dataObject;
	this.g_maxHeight = 0;
	this.g_maxLength = 0;
	this.g_maxValue = 0;
	this.g_unit = 0;
	this._init();
}

//Static Object Properties
//Array For Position And Interval Ids
MeterChart.c_arr_INTERVAL_ID = new Array();
MeterChart.c_arr_POSITION = new Array();

//Runtime Data Object
MeterChart.c_obj_DATA;

//Object Key Names
MeterChart.c_s_ANIMATE = "animate";
MeterChart.c_s_FILL_COLOR = "color";
MeterChart.c_s_DATA = "data";
MeterChart.c_s_DRAW_ONINIT = "draw_oninit";
MeterChart.c_s_FILL_IMG = "fill_img";
MeterChart.c_s_FILL_STYLE = "fill_style";
MeterChart.c_s_GRADIENT_FILL_COLORS = "gradient_colors";
MeterChart.c_s_ID = "id";
MeterChart.c_s_INCREMENT_LENGTH = "increment_length";
MeterChart.c_s_INTERVAL = "interval";
MeterChart.c_s_MAX_HEIGHT = "max_height";
MeterChart.c_s_MAX_LENGTH = "max_length";
MeterChart.c_s_MAX_VAL = "max_value";
MeterChart.c_s_ONCOMPLETE = "oncomplete";
MeterChart.c_s_FILL_PATTERN_IMAGE = "fill_img";
MeterChart.c_s_UNIT = "unit";
MeterChart.c_s_VALUE = "value";

//PAtter Fill Image Object
MeterChart.c_obj_FILL_PATTERN_IMAGE;

//Default Values
MeterChart.c_i_INCREMENT_LENGTH_DEFAULT = 1;
MeterChart.c_i_INTERVAL_DEFAULT = 0.0001;
MeterChart.c_i_MAX_HEIGHT_DEFAULT = 15;
MeterChart.c_i_MAX_LENGTH_DEFAULT = 200;
MeterChart.c_i_SINGLE_COLOR_FILL_DEFAULT = "#6495ED";

//Static Object Methods 
/**
 * function: animationScheduledCallback
 * Objective:
 	- Callback Function For Animation Object
 	- This Will Be Called In Defined Interval To Animate Drawing
 	- This Will Be Set Dynamically And Passed To Animation Scheduler
 */
MeterChart.animationScheduledCallback = function () {}

/**
 * function: animationGradientFill
 * Objective:
 	- Callback Function For Animation Object
 	- This Will Be Called In Defined Interval To Animate Drawing
 	- This Will Create Meter With Gradient
 */
MeterChart.animationGradientFill = function (prm_idx, prm_increment, prm_unit, prm_maxlength, prm_maxheight) {
	//Variable Declaration Block
	var _canvas;
	var _canvasId;
	var _colors = new Array();
	var _context;
	var _data;
	var _gradient;
	var _value;
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within MeterChart.prototype.animationGradientFill(): \n";
	
	//Exception Handling
	try {
		//Get Data From Static Object
		_data = MeterChart.c_obj_DATA[prm_idx];
		
		//Get CanvasId
		_canvasId = _data[MeterChart.c_s_ID];
		//Get Canvas Object
		_canvas = document.getElementById(_canvasId);
		
		//Get Context
		_context = _canvas.getContext("2d");
		
		//Get Value
		_value = _data[MeterChart.c_s_VALUE];
		/*
		 * Get Value In Canvas Unit
		 * i.e. Length In The Canvas To Be Filled
		 * Calculated Value Will Be (_value * prm_unit)
		 */
		_value = _value * prm_unit;
		
		//Set Canvas Width To Max Value; So That All The COrners Are In Rounded Shape
		_canvas.setAttribute("width", _value);
		
		//Get Position For Current Element
		MeterChart.c_arr_POSITION[prm_idx] += prm_increment;
		
		//Get Gradient
		_gradient = _context.createLinearGradient(0, 0, 0, prm_maxheight);
		
		
		//Add Colors For Gradient
		//Get Colors Array
		_colors = _data[MeterChart.c_s_GRADIENT_FILL_COLORS];
		
		//Add Color Stop Areas Based On Array Lengths
		//Will Allow Only 2 And 3 Colors 
		if (_colors.length = 2) {//2 Colors Specified
			//Add Color Stops
			_gradient.addColorStop(0, _colors[0]);
			_gradient.addColorStop(0.40, _colors[1]);
			_gradient.addColorStop(0.60, _colors[1]);
			_gradient.addColorStop(1, _colors[0]);
		} else if (_colors.length > 2) {//3 colors Specified
			//Add Color Stops
			_gradient.addColorStop(0, _colors[0]);
			_gradient.addColorStop(0.20, _colors[1]);
			_gradient.addColorStop(0.40, _colors[2]);
			_gradient.addColorStop(0.60, _colors[2]);
			_gradient.addColorStop(0.80, _colors[1]);
			_gradient.addColorStop(1, _colors[0]);
		}
		
		//Attach Gradient To Fill Style
		_context.fillStyle = _gradient;
		
		//Fill Canvas In Rectangular
		_context.fillRect(0, 0, MeterChart.c_arr_POSITION[prm_idx], prm_maxheight);
		
		//Stop If end Has Reached
		if (MeterChart.c_arr_POSITION[prm_idx] >= _value) {
			MeterChart.stop(prm_idx);
		}
	} catch (_excp) {
		//Create Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
		MeterChart.stop(prm_idx);
	}
}

/**
 * function: animationPatternFill
 * Objective:
 	- Callback Function For Animation Object
 	- This Will Be Called In Defined Interval To Animate Drawing
 	- This Will Create Meter With Pattern
 */
MeterChart.animationPatternFill = function (prm_idx, prm_increment, prm_unit, prm_maxlength, prm_maxheight, prm_img) {
	//Variable Declaration Block
	var _canvas;
	var _canvasId;
	var _context;
	var _data;
	var _pattern;
	var _patternImg;
	var _value;
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within MeterChart.prototype.	(): \n";
	
	//Exception Handling
	try {
		//Get Data From Static Object
		_data = MeterChart.c_obj_DATA[prm_idx];
		
		//Get CanvasId
		_canvasId = _data[MeterChart.c_s_ID];
		//Get Canvas Object
		_canvas = document.getElementById(_canvasId);
		
		//Get Context
		_context = _canvas.getContext("2d");
		
		//Get Value
		_value = _data[MeterChart.c_s_VALUE];
		/*
		 * Get Value In Canvas Unit
		 * i.e. Length In The Canvas To Be Filled
		 * Calculated Value Will Be (_value * prm_unit)
		 */
		_value = _value * prm_unit;
		
		//Set Canvas Width To Max Value; So That All The COrners Are In Rounded Shape
		_canvas.setAttribute("width", _value);
		
		//Get Position For Current Element
		MeterChart.c_arr_POSITION[prm_idx] += prm_increment;
		
		/*
		 * If prm_img Is Null, Create Image Object With Pattern Image
		 * Else, Use The prm_img Object
		 */
		if (MeterChart.c_obj_FILL_PATTERN_IMAGE != null) {
			//Assign prm_img To Pattern Image
			_patternImg = MeterChart.c_obj_FILL_PATTERN_IMAGE;
		} else {
			//Create New Image Object
			_patternImg = new Image();
			//Get Pattern Image Url
			_patternImg.src = _data[MeterChart.c_s_FILL_PATTERN_IMAGE];
		}
		//Set Fill Pattern Image
		//_patternImg = MeterChart.getFillImageObject();
		
		/**
		 * An Workaround
		 * Some Of Webkit Browsers And Mozilla Throw Exception For 
		 * contextObject.createPattern
		 * The Behavior Can Be Ignored With The Following Workaround
		 * We Have Surrounded The Code With An Try Catch Block 
		 * And Done Nothing In Catch Block
		 */
		try {
			//Create Pattern For Canvas Filling
			_pattern = _context.createPattern(_patternImg, "repeat");
		} catch (_ignoreExcp) {
		}
		
		//Fill Canvas In Rectangular
		_context.rect(0, 0, MeterChart.c_arr_POSITION[prm_idx], prm_maxheight);
		//Set Fill Style
		_context.fillStyle = _pattern;
		//Fill
		_context.fill();
		
		//Stop If end Has Reached
		if (MeterChart.c_arr_POSITION[prm_idx] >= _value) {
			MeterChart.stop(prm_idx);
		}
	} catch (_excp) {
		//Create Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg + "--" + prm_idx);
		MeterChart.stop(prm_idx);
	}
}

/**
 * function: animationSingleColorFill
 * Objective:
 	- Callback Function For Animation Object
 	- This Will Be Called In Defined Interval To Animate Drawing
 	- This Will Create Meter With Single Color
 */
MeterChart.animationSingleColorFill = function (prm_idx, prm_increment, prm_unit, prm_maxlength, prm_maxheight) {
	//Variable Declaration Block
	var _canvas;
	var _canvasId;
	var _context;
	var _data;
	var _value;
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within MeterChart.prototype.animationSingleColorFill(): \n";
	
	//Exception Handling
	try {
		//Get Data From Static Object
		_data = MeterChart.c_obj_DATA[prm_idx];
		
		//Get CanvasId
		_canvasId = _data[MeterChart.c_s_ID];
		//Get Canvas Object
		_canvas = document.getElementById(_canvasId);
		
		//Get Context
		_context = _canvas.getContext("2d");
		
		//Get Value
		_value = _data[MeterChart.c_s_VALUE];
		/*
		 * Get Value In Canvas Unit
		 * i.e. Length In The Canvas To Be Filled
		 * Calculated Value Will Be (_value * prm_unit)
		 */
		_value = _value * prm_unit;
		
		//Set Canvas Width To Max Value; So That All The COrners Are In Rounded Shape
		_canvas.setAttribute("width", _value);
		
		//Get Position For Current Element
		MeterChart.c_arr_POSITION[prm_idx] += prm_increment;
				
		//Attach Color To Fill Style
		_context.fillStyle = _data[MeterChart.c_s_FILL_COLOR];
		
		//Fill Canvas In Rectangular
		_context.fillRect(0, 0, MeterChart.c_arr_POSITION[prm_idx], prm_maxheight);
		
		_context.lineCap = "round"; 
		
		//Stop If end Has Reached
		if (MeterChart.c_arr_POSITION[prm_idx] >= _value) {
			
			MeterChart.stop(prm_idx);
		}
	} catch (_excp) {
		//Create Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
		MeterChart.stop(prm_idx);
	}
}

MeterChart.getFillImageObject = function () {
	return MeterChart.c_obj_FILL_PATTERN_IMAGE;
} 

/*
 * function: stop
 * Objective:
 	- Stops Animation Since Limit Has Been Reached
 */
MeterChart.stop = function (prm_idx) {
	//Variable Declaration Block
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within MeterChart.prototype.stop(): \n";
	
	//Exception Handling
	try {
		//Call Clear Interval Function For The Id In The Specified Index
		clearInterval(MeterChart.c_arr_INTERVAL_ID[prm_idx]);
		//Set Interval Id TO 0
		MeterChart.c_arr_INTERVAL_ID[prm_idx] = 0;
		
		//If All Stopped Call On Complete Function
		if (MeterChart.checkAllStopped()) {
			//Re-Initialize Arrays
			MeterChart.c_arr_INTERVAL_ID = new Array();
			MeterChart.c_arr_POSITION = new Array();
			//EXecute On Complete
			MeterChart._onComplete();
		}
	} catch (_excp) {
		//Create Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/*
 * function: stop
 * Objective:
 	- Stops Animation Since Limit Has Been Reached
 */
MeterChart.checkAllStopped = function () {
	var _idx;
	var _arrayLength;
	var _flag = true;
	for(_idx = 0 ; _idx < MeterChart.c_arr_INTERVAL_ID.length; _idx++) {
		if(MeterChart.c_arr_INTERVAL_ID[_idx] != 0 ) {
			_flag = false;
			break;
		}
	}
	return _flag;
};

/**
 * function: _onComplete
 * Objective:
 	- Action on Complete of Meter Chart
 */
MeterChart._onComplete = function () {
	
}

/*
 * Getters and setters of the member variable of the class MeterChart
 */
MeterChart.prototype.getAnimate = function() {
	return this.g_animate;
};

MeterChart.prototype.setAnimate = function(prm_animate) {
	this.g_animate = prm_animate;
};

MeterChart.prototype.getData = function() {
	return this.g_data;
};

MeterChart.prototype.setData = function(prm_data) {
	this.g_data = prm_data;
};

MeterChart.prototype.getFillstyle = function() {
	return this.g_fillStyle;
};

MeterChart.prototype.setFillstyle = function(prm_fillstyle) {
	this.g_fillStyle = prm_fillstyle;
};

MeterChart.prototype.getIncrement = function() {
	return this.g_increment;
};

MeterChart.prototype.setG_increment = function(prm_increment) {
	this.g_increment = prm_increment;
};

MeterChart.prototype.getObject = function() {
	return this.g_object;
};

MeterChart.prototype.setObject = function(prm_object) {
	this.g_object = prm_object;
};

MeterChart.prototype.getMaxHeight = function() {
	return this.g_maxHeight;
};

MeterChart.prototype.setMaxHeight = function(prm_maxheight) {
	this.g_maxHeight = prm_maxheight;
};
MeterChart.prototype.getMaxLength = function() {
	return this.g_maxLength;
};
MeterChart.prototype.setMaxLength = function(prm_maxlength) {
	this.g_maxLength = prm_maxlength;
};

MeterChart.prototype.getMaxValue = function() {
	return this.g_maxValue;
};

MeterChart.prototype.setMaxValue = function(prm_maxvalue) {
	this.g_maxValue = prm_maxvalue;
};

MeterChart.prototype.getUnit = function() {
	return this.g_unit;
};

MeterChart.prototype.setG_unit = function(prm_unit) {
	this.g_unit = prm_unit;
};

//Object Member Method
/**
 * function: animate
 * Objective:
 	- Runs Scheduler For Animation
 */
MeterChart.prototype.animate = function (prm_idx, prm_funcStr) {
	//Variable Declaration Block
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within MeterChart.prototype.animate(): \n";
	
	//Exception Handling
	try {
		/*
		 * Call Set Interval Function To Schedule;
		 * This Will Implement An Increasing Animation Effect
		 */
		MeterChart.c_arr_INTERVAL_ID[prm_idx] = setInterval(prm_funcStr, this.g_interval);
	} catch (_excp) {
		//Create Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/**
 * function: animateDrawChart
 * Objective:
 	- Initiates Chart Drawing With Animation
 */
MeterChart.prototype.animateDrawChart = function () {
	//Variable Declaration Block
	var _currIdx;
	var _fillStyle
	var _funcStr;
	var _data;
	var _increment;
	var _maxHeight;
	var _maxLength;
	var _unit;
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within MeterChart.prototype.animateDrawChart(): \n";
	
	//Exception Handling Block
	try {
		//Prepare Parameters Which Are Not Dependent On Index
		_increment = this.g_increment;
		_maxLength = this.g_maxLength;
		_maxHeight = this.g_maxHeight;
		_unit = this.g_unit;
		MeterChart.c_obj_DATA = this.g_data;
		
		//Traverse Through Object Array To Initiate Animation
		for (var _idx = 0; _idx < this.g_data.length; _idx++) {
			//Initialize Position
			MeterChart.c_arr_POSITION[_idx] = 0;
			
			/*
			 * Set _currIdx
			 * This Variable Is Used Since _idx Is Incremental
			   And Scheduler Will Only Consider The Incremental Value
			 */
			_currIdx = _idx;
						
			/*
			 * Decide FillStyle Here, To Call Function Based On The Fill Style
			 * __ If Fill Style Is Pattern And Image Specified;
			 	  Set Fill Style To Pattern Fill And Set Fill Image
		 	   __ If Fill Style Is Pattern And Image Is Not Specified;
		 	      Set Fill Style To Single Color
			 * __ If Fill Style Is Gradient And Color Array Is Specified;
			 	  Set Fill Style To Gradient And Set Color Array
		 	   __ If Fill Style Is Gradient And Color Array Is Not Specified;
		 	      Set Fill Style To Single Color
		 	 * __ If Fill Style Is Single Color Or Null And Color Specified;
			 	  Set Fill Style To Single Color Fill And Set Fill Color
			   __ If Fill Color Is Single Color Or Null And Color Not Specified;
			   	  Set Fill Style To Single Color
			 */
			switch (this.g_fillStyle) {
				case ChartConstant.c_s_FILL_STYLE_PATTERN://Case Pattern
					if (this.g_data[0][MeterChart.c_s_FILL_PATTERN_IMAGE]) {//Pattern Image Specified
						_fillStyle = ChartConstant.c_s_FILL_STYLE_PATTERN;
					} else if (this.g_fillImage != null) {//Pattern Image Specified As Same For All
						_fillStyle = ChartConstant.c_s_FILL_STYLE_PATTERN;
					} else {//Pattern Image Not Specified
						_fillStyle = ChartConstant.c_s_FILL_STYLE_SINGLE_COLOR;
					}
					break;
				case ChartConstant.c_s_FILL_STYLE_GRADIENT://Case Gradient
					if (this.g_data[0][MeterChart.c_s_GRADIENT_FILL_COLORS]) {//Color Array Specified
						_fillStyle = ChartConstant.c_s_FILL_STYLE_GRADIENT;
					} else {//Color Array Not Specified
						_fillStyle = ChartConstant.c_s_FILL_STYLE_SINGLE_COLOR;
					}
					break;
				case ChartConstant.c_s_FILL_STYLE_SINGLE_COLOR://Case Single Color
				default://Case Null
					_fillStyle = ChartConstant.c_s_FILL_STYLE_SINGLE_COLOR;
					break;
			}
			
			//Call Function Based On The Fill Pattern
			switch (_fillStyle) {
				case  ChartConstant.c_s_FILL_STYLE_PATTERN://Case Pattern
					//Create Fill Image Object
					if (this.g_fillImage != null) {
						//g_fillImage
						MeterChart.c_obj_FILL_PATTERN_IMAGE = new Image();
						//Get Pattern Image Url
						MeterChart.c_obj_FILL_PATTERN_IMAGE.src = this.g_fillImage;
					}
					//Prepare Callback Function As String
					_funcStr = "MeterChart.animationPatternFill(" + _idx + ", " +  _increment + "," + _unit + ", " + _maxLength + ", " + _maxHeight + ")"
					break;
				case  ChartConstant.c_s_FILL_STYLE_GRADIENT://Case Gradient
					//Prepare Callback Function As String
					_funcStr = "MeterChart.animationGradientFill(" + _idx + ", " +  _increment + "," + _unit + ", " + _maxLength + ", " + _maxHeight + ")"
					break;
				case  ChartConstant.c_s_FILL_STYLE_SINGLE_COLOR://Case Single Color
					//Prepare Callback Function As String
					_funcStr = "MeterChart.animationSingleColorFill(" + _idx + ", " +  _increment + "," + _unit + ", " + _maxLength + ", " + _maxHeight + ")";
					break;
			}
						 
			//Initiate Animation
			this.animate(_currIdx, _funcStr);
		}
	} catch (_excp) {
		//Create Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/**
 * function: drawChart
 * Objective:
 	- drawChart Function To Draw Chart Without Animation
 	- This Will Directly Fill Areas Upto Value
 */
MeterChart.prototype.drawChart = function () {
	
}

/**
 * function: findMaxValue
 * Objective:
  	- Get Max Value From Object
 */
MeterChart.prototype.findMaxValue = function () {
	//Variable Declaration Block
	var _currvalue = 0;
	var _object;
	var _return = 0;
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within MeterChart.prototype.findMaxValue(): \n";
	
	//Exception Handling
	try {
		//Traverse Through The Object Array To Apply The Search
		for (var _idx = 0; _idx < this.g_data.length; _idx++) {
			//Get Object At The Index
			_object = this.g_data[_idx];
			//Get Value At Current Index
			_currvalue = _object[MeterChart.c_s_VALUE] * 1;
			
			/*
			 * If Value At Current Index Is Greater Than _maxvalue;
			 * Set Value At _maxvalue
			 */
			if (_return < _currvalue) {
				_return = _currvalue;
			}
		}
	} catch (_excp) {
		//Create Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
		
	}
	
	return _return;
}

/**
 * function: _init
 * Objective:
 	- Configures Chart Parameters
 */
MeterChart.prototype._init = function () {
	//Variable Declaration Block
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within MeterChart.prototype._init(): \n";
	
	//Exception Handling
	try {
		/*
		 * If Data Is Specified, Get Data Object
		 * Else, Throw Exception
		 */
		if (this.g_object[MeterChart.c_s_DATA] != null) {
			//Get Data To Be Populated
			this.g_data = this.g_object[MeterChart.c_s_DATA];
		} else {
			throw "Data Not Available!";
		}
		
		/*
		 * If Animate Is True, Get Animate Flag
		 */
		if (this.g_object[MeterChart.c_s_ANIMATE] != null) {
			this.g_animate = this.g_object[MeterChart.c_s_ANIMATE];
		}
		
		/*
		 * If Interval Is Specified, Get Interval Value
		 * Else, Set TO Default
		 */
		if (this.g_object[MeterChart.c_s_INTERVAL]) {
			this.g_interval = this.g_object[MeterChart.c_s_INTERVAL] * 1;
		} else {
			this.g_interval = MeterChart.c_i_INTERVAL_DEFAULT;
		}
		
		/*
		 * If Fill Style Is Specified, Get Fill Style
		 * Else, Populate With Default Value i.e. "plain"
		 */
		if (this.g_object[MeterChart.c_s_FILL_STYLE] != null) {
			this.g_fillStyle = this.g_object[MeterChart.c_s_FILL_STYLE];
		} else {
			this.g_fillStyle = ChartConstant.c_s_FILL_STYLE_SINGLE_COLOR;
		}
		
		/*
		 * If Increment Length Is Specified, Get Increment Length
		 * Else, Populate With Default Value
		 */
		if (this.g_object[MeterChart.c_s_INCREMENT_LENGTH]) {
			this.g_increment = this.g_object[MeterChart.c_s_INCREMENT_LENGTH];
		} else {
			this.g_increment = MeterChart.c_i_INCREMENT_LENGTH_DEFAULT;
		}
		
		/*
		 * If Unit Is Specified, Get Unit For Values
		 * Else, Check For Max Length And Value 
		 */
		if (this.g_object[MeterChart.c_s_UNIT]) {
			this.g_unit = this.g_object[MeterChart.c_s_UNIT];
		} else {
			/*
			 * If Max Length is Specified, Get Max Length
			 * Else, Set TO Default
			 */
			if (this.g_object[MeterChart.c_s_MAX_LENGTH]) {
				this.g_maxLength = this.g_object[MeterChart.c_s_MAX_LENGTH];
			} else {
				this.g_maxLength = MeterChart.c_i_MAX_LENGTH_DEFAULT;
			}
			
			/*
			 * If Max Value is Specified, Get Max Value And Calculate Unit
			 * Else, Extract Max Value From Data Object And Calculate Unit
			 */
			if (this.g_object[MeterChart.c_s_MAX_VALUE]) {
				//Get Max Value
				this.g_maxValue = this.g_object[MeterChart.c_s_MAX_VALUE];
			} else {
				//Call Function To Extract Max Value From Data Object
				this.g_maxValue = this.findMaxValue();
			}
			
			/*
			 * If g_maxValue Is Not 0, Calculate Unit
			 * Else, Throw Exception
			 */
			if (this.g_maxValue > 0) {
				this.g_unit = this.g_maxLength/this.g_maxValue;
			} else {
				throw "Value Cannot Be Lesser Than Or Equal To 0";
			}
		}
		
		/*
		 * If Max Height Is Specified, Get height
		 * Else, Populate With Default Value
		 */
		if (this.g_object[MeterChart.c_s_MAX_HEIGHT]) {
			this.g_maxHeight = this.g_object[MeterChart.c_s_MAX_HEIGHT];
		} else {
			this.g_maxHeight = MeterChart.c_i_MAX_HEIGHT_DEFAULT;
		}
		
		//Initialize Position Array And Index Array
		for (var _idx = 0; _idx < this.g_data.length; _idx++) {
			MeterChart.c_arr_POSITION[_idx] = 0;
		}
		
		//Get Fill Image Url
		if (this.g_object[MeterChart.c_s_FILL_IMG]) {
			this.g_fillImage = this.g_object[MeterChart.c_s_FILL_IMG]
		}
				
		//If draw_oninit Is Set To True, Start Drawing
		if (this.g_object[MeterChart.c_s_DRAW_ONINIT] == true) {
			this.startDrawing();
		}
		
		//If On COmplete Is Passed Set On Complete Action
		if (this.g_object[MeterChart.c_s_ONCOMPLETE]) {
			MeterChart._onComplete = this.g_object[MeterChart.c_s_ONCOMPLETE];
		}
	} catch (_excp) {
		//Create Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}



/**
 * function: drawCharts
 * Objective:
 	- Configures Chart Parameters
 */
MeterChart.prototype.startDrawing = function () {
	//Variable Declaration Block
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within MeterChart.prototype.startDrawing(): \n";
	
	//Exception Handling
	try {
		/*
		 * If Animate Flag Is Set To True, Call animateDrawChart Method To Draw Chart
		 * Else, Call drawChart Method To Draw Chart
		 */ 
		if (this.g_animate) {
			//Animate Chart Drawing
			this.animateDrawChart();
		} else {
			//Draw Charts Directly; i.e. Without Any Animation
			this.drawChart();
		}
	} catch (_excp) {
		//Create Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
		
	}
}
//Meter Chart Object Ends                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 