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
 ********************** Pie Chart *****************************
 ****************************************************************/

/**
  * Pie Chart Object
  * Parameters:
		- JSON From Which Chart Will Be Drawn
  */
function PieChart (prm_data, prm_draw) {
	this._dataParam = prm_data;
	this._animate;
	this._centerX;
	this._centerY;
	this._cnvElem;
	this._cnvId;
	this._ctx;
	this._data;
	this._legend;
	this._legendPosition;
	this._legendWidth;
	this._legendColorBandWidth;
	this._legendItemPadding;
	this._legendTextStyle;
	this._padding = 20;
	this._valueDisplayPadding = 10;
	this._valuesObj;
	this._radius;
	this._sum;
	this._draw = (prm_draw == null) ? true : prm_draw;
	this._onclick;
	this._init();
}

//Static Variables Start
PieChart.c_s_KEY_ID = "id";
PieChart.c_s_KEY_DATA = "data";
PieChart.c_s_KEY_FILL_STYLE = "fill_style";
PieChart.c_s_KEY_FILL_SLICE_SHADOW = "slice_shadow";
PieChart.c_s_KEY_VALUES = "values";
PieChart.c_s_KEY_WIDTH = "width";
PieChart.c_s_KEY_VAL = "val";
PieChart.c_s_KEY_LABEL = "label";
PieChart.c_s_KEY_VISIBLE = "visible";
PieChart.c_s_KEY_COLOR = "color";
PieChart.c_s_KEY_ANIMATE = "animate";
PieChart.c_s_KEY_LEGEND = "legend";
PieChart.c_s_KEY_POSITION = "position";
PieChart.c_s_KEY_COLOR_BAND_WIDTH = "colorbandwidth";
PieChart.c_s_KEY_ITEM_PADDING = "itempadding";
PieChart.c_s_KEY_TEXT_STYLE = "textstyle";
PieChart.c_s_KEY_DRAW_ONINIT = "drawoninit";
PieChart.c_s_KEY_ONCLICK = "onclick";
PieChart.c_s_KEY_ONPULLOUTCOMPLETE = "onpulloutcomplete";

//Custom Actions
PieChart.c_s_CUSTOM_ACTION_CLICK = "click";
PieChart.c_s_CUSTOM_ACTION_PULLOUTCOMPLETE = "pulloutcomplete";

/*
 * Position Values
 * These Values Will Be Based On The Map Directions
 * Legend Is Allowed Either In Left Or In Right Side of The Chart
 * According To Map Direction
	North West                North East
		  West  (Chart Here)  East
	South West                South East
 */
PieChart.c_s_POSITION_NE = "ne";
PieChart.c_s_POSITION_E = "e";
PieChart.c_s_POSITION_SE = "se";
PieChart.c_s_POSITION_SW = "sw";
PieChart.c_s_POSITION_W = "w";
PieChart.c_s_POSITION_NW = "nw";

//Default Values
PieChart.c_obj_SLICE_BORDER = {
			"width" : 0.5,
			"color" : "#FFFFFF"
		};
PieChart.c_obj_VALUES = {
			"visible" : true,
			"color" : "#000000"
		};
PieChart.c_obj_LEGEND = {
			"visible" : true,
			"position": "e",
			"width" : 220,
			"colorbandwidth" : 20,
			"itempadding" : 2,
			"textstyle" : "small Verdana"
		};

//Static Values For Animation
PieChart.c_i_INTERVAL_DURATION = 0.1;
PieChart.c_i_INTERVAL_ID = 0;
PieChart.c_n_PULLOUT_DISTANCE = 10;
PieChart.c_n_PULLOUT_LENGTH = 0.5;
PieChart.c_n_PULLOUT_CURRENT_LENGTH = 0;

//Static Methods Start
/**
 * function: animatePullout
 * Objective:
	* Animates Pull Out
 */
PieChart.animatePulloutSlice = function (prm_chartObject, prm_clickAngle) {
	//Variable Declaration Block
	var _chartObject;
	var _center;
	var _centerX;
	var _centerY;
	var _pullAngle;
	var _pieChart;
	var _excpMsg;
	
	//Variable Initialization Block
	_chartObject = prm_chartObject;
	_excpMsg = "Within animatePullout(): \n";
	
	//Exception Handling Block
	try {
		//Next Pull Out Distance
		PieChart.c_n_PULLOUT_CURRENT_LENGTH += PieChart.c_n_PULLOUT_LENGTH;
		
		//Call pulloutSlice Method To Pull Out
		prm_chartObject.pulloutSlice(prm_clickAngle, PieChart.c_n_PULLOUT_CURRENT_LENGTH);
		
		//Stop Animation If Maximum Pull Out Distance Reached
		if (PieChart.c_n_PULLOUT_CURRENT_LENGTH >= PieChart.c_n_PULLOUT_DISTANCE) {
			//Stop Animation
			PieChart.stopAnimation()
			/*
			 * If Pull Out Complete Action Is Defined, Execute Pullout Complete Action
			 */
			prm_chartObject.executeCustomActions(prm_clickAngle, PieChart.c_s_CUSTOM_ACTION_PULLOUTCOMPLETE);
		}
	} catch (_excp) {
		//Set Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/**
 * function: stopAnimation
 * Objective:
	- Sets Animation Parameters To Default
	- Stops Any Running Animation
 */
PieChart.stopAnimation = function () {
	//Variable Declaration Block
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within stopAnimation(): \n";
	
	//Exception Handling Block
	try {
		//Stop Animation
		//Initialize Animation Parameters To Default For Next Animation
		PieChart.c_i_INTERVAL_DURATION = 0.1;
		PieChart.c_n_PULLOUT_DISTANCE = 10;
		PieChart.c_n_PULLOUT_LENGTH = 0.5;
		PieChart.c_n_PULLOUT_CURRENT_LENGTH = 0;
			
		//Clear Interval To Stop Animation
		clearInterval(PieChart.c_i_INTERVAL_ID);
		
		//Set Interval Id To 0
		PieChart.c_i_INTERVAL_ID = 0;
	} catch (_excp) {
		//Set Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

//Blank Function Stubs
/**
 * function: onClick
 * Objective:
	- This Is Blank Stub For Handling On Click
 */
PieChart.onClick = function (prm_obj) {}
/**
 * function: onPulloutComplete
 * Objective:
	- This Is Blank Stub For Execute Any Method On Pull Out Complete
 */
PieChart.onPulloutComplete = function (prm_obj) {}
//Static Methods End

//Member Methods Start
//Getters And Setters Start
/**
 * function: getCenterX
 * Objective:
	- Get X Co-ordinate Of Center
 */
PieChart.prototype.getCenterX = function () {
	return this._centerX;
}

/**
 * function: getCenterY
 * Objective:
	- Get Y Co-ordinate Of Center
 */
PieChart.prototype.getCenterY = function () {
	return this._centerY;
}

/**
 * function: getCenter
 * Objective:
	- Get Co-ordinates Of Center
 */
PieChart.prototype.getCenter = function () {
	return [this._centerX, this._centerY];
}
//Getters And Setters End


/**
 * function: _init
 * Objective:
	* Initializes Object For Drawing Chart
 */
PieChart.prototype._init = function () {
	//Variable Declaration Block
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within _init(): \n";
	
	//Exception Handling Block
	try {
		/*
		 * If prm_data Is Passed As Parameters, Execute Further Logic
		 * Else, Throw Error And Break Out Of The function
		 */
		if (this._dataParam != null) {
			/*
			 * If Parameter Contains "id" Attribute, Execute Further Logic
			 * Else, Throw Exception And Break Out Of Function
			 */
			if (this._dataParam[PieChart.c_s_KEY_ID] == null) {//Id Does Not Exist
				//Throw Exception
				throw "Id Value Is Not Passed. Chart Cannot Be Processed";
			} else {//Id Exists
				//Set Canvas Id
				this._cnvId = this._dataParam[PieChart.c_s_KEY_ID];

				//Get Canvas Element
				this._cnvElem = document.getElementById(this._cnvId);
				
				//Get Context Reference
				this._ctx = this._cnvElem.getContext("2d");
				
				//Get Data Point
				this._data = this._dataParam[PieChart.c_s_KEY_DATA];
				
				//Call Method To Get The Sum Of Values
				this._sum = this.getSum();
				
				//Get Legend Parameters
				//Get Legend Object
				this._legend = this._dataParam[PieChart.c_s_KEY_LEGEND] != null ? this._dataParam[PieChart.c_s_KEY_LEGEND] : PieChart.c_obj_LEGEND;
				//Legend Position
				this._legendPosition = this._legend[PieChart.c_s_KEY_POSITION] != null ? this._legend[PieChart.c_s_KEY_POSITION] : PieChart.c_obj_LEGEND[PieChart.c_s_KEY_POSITION];
				//Legend Width
				this._legendWidth = this._legend[PieChart.c_s_KEY_WIDTH] != null ? this._legend[PieChart.c_s_KEY_WIDTH] : PieChart.c_obj_LEGEND[PieChart.c_s_KEY_WIDTH];
				//Legend Color Band Width
				this._legendColorBandWidth = this._legend[PieChart.c_s_KEY_COLOR_BAND_WIDTH] != null ? this._legend[PieChart.c_s_KEY_COLOR_BAND_WIDTH] : PieChart.c_obj_LEGEND[PieChart.c_s_KEY_COLOR_BAND_WIDTH];
				//Legend Item Padding
				this._legendItemPadding = this._legend[PieChart.c_s_KEY_ITEM_PADDING] != null ? this._legend[PieChart.c_s_KEY_ITEM_PADDING] : PieChart.c_obj_LEGEND[PieChart.c_s_KEY_ITEM_PADDING];
				//Legend Text Style
				this._legendTextStyle = this._legend[PieChart.c_s_KEY_TEXT_STYLE] != null ? this._legend[PieChart.c_s_KEY_TEXT_STYLE] : PieChart.c_obj_LEGEND[PieChart.c_s_KEY_TEXT_STYLE];
				
				//Get Center And Radius			
				//Center Y Point
				this._centerY = this._cnvElem.height / 2;
				/*
				 * Get Center X Co-ordinates Based On The Legend Position
				 */
				switch (this._legendPosition) {
					//Legend Position Right
					case PieChart.c_s_POSITION_NE:
					case PieChart.c_s_POSITION_E:
					case PieChart.c_s_POSITION_SE:
						//Center X Point
						this._centerX = (this._cnvElem.width - this._legendWidth)/2;
						break;
					//Legend Position Left
					case PieChart.c_s_POSITION_NW:
					case PieChart.c_s_POSITION_W:
					case PieChart.c_s_POSITION_SW:
						//Center X Point
						this._centerX = this._legendWidth + (this._cnvElem.width - this._legendWidth)/2;
						break;
				}

				/*
				 * Radius:
				 * Diameter Of The Chart Will Be Least Value Of Width And Height
				 * Subtract A Little Padding From The Least Value
				 */
				if (this._centerX > this._centerY) {//Height Is Least
					this._radius = this._centerY;
				} else {//Width Is Least
					this._radius = this._centerX;
				}
				//Subtract Padding
				this._radius = this._radius - 30;
				
				//Get Animation Flag
				this._animate = this._dataParam[PieChart.c_s_KEY_ANIMATE] == null ? false : this._dataParam[PieChart.c_s_KEY_ANIMATE];
				
				//Get Values Configuration
				this._valuesObj = (this._dataParam[PieChart.c_s_KEY_VALUES] == null) ? PieChart.c_obj_VALUES : this._dataParam[PieChart.c_s_KEY_VALUES];
				
				//Get On Click Action Value
				if (this._dataParam[PieChart.c_s_KEY_ONCLICK]) {
					//Set To Stub
					PieChart.onClick = this._dataParam[PieChart.c_s_KEY_ONCLICK];
				}
				
				//Get Pullout Complete Action Value
				if (this._dataParam[PieChart.c_s_KEY_ONPULLOUTCOMPLETE]) {
					//Set The Stub
					PieChart.onPulloutComplete = this._dataParam[PieChart.c_s_KEY_ONPULLOUTCOMPLETE];
				}
				
				//Draw Chart If this_draw Is True And Draw On Init Value Is Set To True
				if (this._draw && this._dataParam[PieChart.c_s_KEY_DRAW_ONINIT]) {
					//Set Chart Value Param In Session
					ClientSession.set(PieChart.c_s_KEY_SESSION, JSON.stringify(this._dataParam)),
				
					//Draw Chart
					this.drawChart();
				}
			}
		} else {//Data Is Not Passed
			//Display Message
			throw "Invalid Or No Data Passed. Chart Cannot Be Processed";
		}
	} catch (_excp) {
		//Set Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/**
 * function: getSum
 * Objective:
	- Draws Chart From The Values
 */
PieChart.prototype.getSum = function () {
	//Variable Declaration Block
	var _return;
	var _tempObj;
	var _excp;
	
	//Variable Initialization Block
	_return = 0;
	_excpMsg = "Within getSum(): \n";
	
	//Excpetion Handling Block
	try {
		//Traverse Through The Values To Get Sum
		for (var _idx = 0; _idx < this._data.length; _idx++) {
			//Get Object In Each Index
			_tempObj = this._data[_idx];
			
			//Get Sum Of Values
			_return += _tempObj[PieChart.c_s_KEY_VAL];
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

/**
 * function: drawChart
 * Objective:
	- Draws The Chart
 */
PieChart.prototype.drawChart = function () {
	//Variable Declaration Block
	var _currAngle;
	var _tempAngle;
	var _legendItemTop;
	var _tempObj;
	var _val;
	var _excp;
	
	//Variable Initialization Block
	_currAngle = 0;
	_tempAngle = 0;
	_excpMsg = "Within drawChart(): \n";
	
	//Excpetion Handling Block
	try {
		//Clear Canvas For Next Drawing
		this.clear();
	
		//Traverse Through The Values To Get Sum
		for (var _idx = 0; _idx < this._data.length; _idx++) {
			//Get Object In Each Index
			_tempObj = this._data[_idx];
			
			//Get Value
			_val = _tempObj[PieChart.c_s_KEY_VAL];
			
			//Get Current Angle
			_currAngle = (2 * Math.PI) * (_val/this._sum);
			//Add Temp Angle To Get End Angle
			_currAngle = _currAngle + _tempAngle;

			//Calculate Legend Item Top Position
			_legendItemTop = this._cnvElem.height - ((this._data.length - _idx) * (this._legendColorBandWidth + (this._legendItemPadding * 2)));

			//Call Function To Draw Slice
			this.drawSlice(_tempAngle, _currAngle, _tempObj[PieChart.c_s_KEY_COLOR]);
			//If Values Is Set Visible, Call Function To Display Values
			if (this._valuesObj[PieChart.c_s_KEY_VISIBLE] == null || this._valuesObj[PieChart.c_s_KEY_VISIBLE]) {
				this.drawValues(_val, _tempAngle, _currAngle);
			}
			//Call Function To Draw Legend
			this.drawLegend(_idx, _val, _tempObj[PieChart.c_s_KEY_LABEL], _tempObj[PieChart.c_s_KEY_COLOR][0]);
			
			//Set Temporary Angle For Next Iteration
			_tempAngle = _currAngle;
		}
		
		//Draw Overall Shadow
		this.drawShadow("#000000");
	} catch (_excp) {
		//Set Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/**
 * function: drawValues
 * Objective:
	- Draw The Values For Slices
 */
PieChart.prototype.drawValues = function (prm_val, prm_startAngle, prm_endAngle, prm_centerX, prm_centerY) {
	//Variable Declaration Block
	var _centerX;
	var _centerY;
	var _color;
	var _rotateAngle;
	var _startX;
	var _startY;
	var _textMetrics;
	var _excp;
	
	//Variable Initialization Block
	_excpMsg = "Within drawValues(): \n";
	
	//Exception Handling Block
	try {
		/*
		 * If prm_cneterX Is Passed, Set _centerX To prm_centerX
		 * Else, Set To Object Property i.e. this._centerX
		 * Simmilarly For _centerY
		 * This Is Move Values with Pullout Animation
		 */
		_centerX = (prm_centerX == null) ? this._centerX : prm_centerX;//X
		_centerY = (prm_centerY == null) ? this._centerY : prm_centerY;//Y
		/*
		 * Get The Angle To Rotate
		 * Rotate Angle Will Be The Mid Angle Of Start And End Angle
		 */
		_rotateAngle = (prm_startAngle + prm_endAngle)/2;
		
		//Get Co-Ordinates Of Text
		//X
		_startX = (this._radius + this._valueDisplayPadding) * Math.cos(_rotateAngle) + _centerX;
		//Y
		_startY = (this._radius + this._valueDisplayPadding) * Math.sin(_rotateAngle) + _centerY;
		
		/*
		 * Check If Text Will Overlap The Slice
		 * Mainly We Need To Adjust The x Co-ordinate Here
		 * Use Circle Geometry
		 * (x-a)^2 + (y-b)^2 = r^2
		 * Use Above Formula To Get Distance From Center
		 * For 2nd And 3rd Quadrant, Cosine Value Of Text Angle Will Be Negative,
		   Subtract Text Width With Calculated X Point To Prevent The OverLap
		 * __For 1st And 4th Qudrant, Text Will Never Overlap With Slice,
		   __Since Text Direction Will Be Away From The Slice
		 */
		_distanceFromCenter = Math.sqrt(Math.pow(Math.abs(_startX - _centerX), 2) + Math.pow( Math.abs(_startY - _centerY), 2));
		//Get Text Metrics
		_textMetrics = this._ctx.measureText(prm_val);
		//Get Adjusted Distance
		if ((_distanceFromCenter - _textMetrics.width) <= this._radius && Math.cos(_rotateAngle) < 0) {
			_startX = _startX - _textMetrics.width;
		}
		
		//Draw Text Value
		//Set Color
		_color = this._valuesObj[PieChart.c_s_KEY_COLOR];
		//Set Fill Style
		this._ctx.fillStyle = _color;
		//Set Font Style
		this._ctx.font = this._legendTextStyle;
		//Align Text To Middle
		this._ctx.textBaseline = "middle";
		//Draw Text	
		this._ctx.fillText(prm_val, _startX, _startY);
	} catch (_excp) {
		//Set Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/**
 * function: drawLegend
 * Objective:
	- Draws Legend
 */
PieChart.prototype.drawLegend = function (prm_idx, prm_val, prm_label, prm_color) {
	//Variable Declaration Block
	var _colorBandStartX;
	var _colorBandStartY;
	var _textStartX;
	var _textStartY;
	var _excp;
	
	//Variable Initialization Block
	_excpMsg = "Within drawLegend(): \n";
	
	//Exception Handling Block
	try {
		//Calculate Color Band Co-ordinates For Each Item
		//Calculation Will Be Based On Legend Position
		//Get X Co-ordinates
		switch (this._legendPosition) {
			/*
			 * Legend Position Right
			 * X Position Will Be Like:
				(Total Area Width - Legend Width) + Legend Item Padding
			 */
			case PieChart.c_s_POSITION_NE:
			case PieChart.c_s_POSITION_E:
			case PieChart.c_s_POSITION_SE:
				//X Co-ordinate
				_colorBandStartX = (this._cnvElem.width - this._legendWidth) + this._legendItemPadding;
				break;
			/*
			 * Legend Position Left
			 * X Position Will Be Like:
				Legend Item Padding
			 */
			case PieChart.c_s_POSITION_NW:
			case PieChart.c_s_POSITION_W:
			case PieChart.c_s_POSITION_SW:
				//X Co-ordinate
				_colorBandStartX = this._legendItemPadding;		
				break;
		}
		//Get X Co-ordinates
		switch (this._legendPosition) {
			/*
			 * Legend Position Top
			 * Y Position Will Be Like
				Legend Item Padding + (Traversed Index * Each Item Height)
				** Each Item Height = Legend Color Band Width  + Legend Item Both Side Padding
				** Legend Item Both Side Padding = Legend Item Top Padding + Legend Item Bottom Padding
			 */
			case PieChart.c_s_POSITION_NE:
			case PieChart.c_s_POSITION_NW:
				//Y Co-ordinates
				_colorBandStartY = this._legendItemPadding + (prm_idx * (this._legendColorBandWidth + (this._legendItemPadding * 2)));
				break;
			/*
			 * Legend Position Middle
			 * Y Position Will Be Like
				Canvas Height - (To Be Traversed Index * Each Item Height))
				** To Be Traversed Index = Data Array Length - Current Index
				** Each Item Height = Legend Color Band Width  + Legend Item Both Side Padding
				** Legend Item Both Side Padding = Legend Item Top Padding + Legend Item Bottom Padding
			 */
			case PieChart.c_s_POSITION_SE:
			case PieChart.c_s_POSITION_SW:
				//Y Co-ordinates
				_colorBandStartY = this._cnvElem.height - ((this._data.length - prm_idx) * (this._legendColorBandWidth + (this._legendItemPadding * 2)));
				break;
			/*
			 * Legend Position Middle
			 * Y Position Will Be Like
				(Canvas Height - (Data Array Length * Each Item Height)) + Legend Item Padding + (Data Array Length * Each Item Height)
				** Each Item Height = Legend Color Band Width  + Legend Item Both Side Padding
				** Legend Item Both Side Padding = Legend Item Top Padding + Legend Item Bottom Padding
			 */
			case PieChart.c_s_POSITION_E:
			case PieChart.c_s_POSITION_W:
				//Y Co-ordinates
				_colorBandStartY = (this._cnvElem.height - (this._data.length * (this._legendColorBandWidth + (this._legendItemPadding * 2))))/2 + this._legendItemPadding + (prm_idx * (this._legendColorBandWidth + (this._legendItemPadding * 2)));
				break;
			
		}
		
		//Calculate Text Co-ordinates For Each Item
		//Get X Co-ordinates For Text
		_textStartX = _colorBandStartX + this._legendColorBandWidth + this._legendItemPadding;
		//Get Y Co-ordinates For Text; Start Y Co-ordinate Will Not Change
		_textStartY = _colorBandStartY;
				
		//Create Legend
		//Set Fill Style
		this._ctx.fillStyle = prm_color;
		//Draw Color Band
		this._ctx.fillRect(_colorBandStartX, _colorBandStartY, this._legendColorBandWidth, this._legendColorBandWidth);
		//Draw Text		
		//Style Text
		this._ctx.font = this._legendTextStyle;
		//Align Text To Middle
		this._ctx.textBaseline = "hanging";
		//Draw Text
		this._ctx.fillText(prm_label, _textStartX, _textStartY);
	} catch (_excpMsg) {
		//Set Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/**
 * function: drawSlice
 * Objective:
	- Draws The Slices
 */
PieChart.prototype.drawSlice = function (prm_startAngle, prm_endAngle, prm_colors, prm_centerX, prm_centerY) {
	//Variable Declration Block
	var _val;
	var _centerX;
	var _centerY;
	var _sliceBorder;
	var _sliceShadow;
	var _excpMsg;
	
	//Variable Initialization Block
	var _excpMsg = "Within drawSlice(): \n";
	
	//Exception Handling Block
	try {
		//Get Center Point First
		//Center Is Not Passsed, Set To Global
		if (prm_centerX == null) {
			_centerX = this._centerX;
		} else {
			_centerX = prm_centerX;
		}
		if (prm_centerY == null) {
			_centerY = this._centerY;
		} else {
			_centerY = prm_centerY;
		}
	
		//Begin Drawing
		this._ctx.beginPath();
		//Create Slice Area
		this._ctx.moveTo(_centerX, _centerY);
		//Draw Arc
		this._ctx.arc(_centerX, _centerY, this._radius, prm_startAngle, prm_endAngle, false);
		//Enclose Silce Area
		this._ctx.lineTo(_centerX, _centerY);
		
		//Call Function To Fill Slice
		this.fillSlice(prm_colors);
		
		//Draw Slice Border
		//Get Slice Border Object
		_sliceBorder = PieChart.c_obj_SLICE_BORDER;
		
		//Draw Slice Border
		this.drawSliceBorder(_sliceBorder[PieChart.c_s_KEY_WIDTH], _sliceBorder[PieChart.c_s_KEY_COLOR]);
		
		//Draw Slice Shadow
		//Get Slice Shadow Object
		_sliceShadow = this._dataParam[PieChart.c_s_KEY_FILL_SLICE_SHADOW];
		
		//Draw Slice Border
		if (_sliceShadow != null && _sliceShadow[PieChart.c_s_KEY_VISIBLE]) {
			this.drawShadow(_sliceShadow[PieChart.c_s_KEY_COLOR]);
		}
	} catch (_excp) {
		//Set Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/**
 * function: fillSlice
 * Objective:
	- Fills Color As Specified In Data JSON
 */
PieChart.prototype.fillSlice = function (prm_colors) {
	//Variable Declration Block
	var _fillStyle;
	var _excpMsg;
	
	//Variable Initialization Block
	var _excpMsg = "Within fillSlice(): \n";
	
	//Exception Handling Block
	try {	
		//get Fill Style From Data
		_fillStyle = this._dataParam[PieChart.c_s_KEY_FILL_STYLE];
		
		//Fill Shart Slice Based On The FIll Style
		switch (_fillStyle) {
			case ChartConstant.c_s_FILL_STYLE_SINGLE_COLOR://Case: Plain Fill
				//Call Method 
				this.fillSlicePlain(prm_colors);
				break;
			case ChartConstant.c_s_FILL_STYLE_GRADIENT://Case: Gradient Fill
				//Call Method 
				this.fillSliceGradient(prm_colors);
				break;
		}
	} catch (_excp) {
		//Set Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/**
 * function: fillSlicePlain
 * Objective:
	- Fills Slice With Single Color
 */
PieChart.prototype.fillSlicePlain = function (prm_color) {
	//Variable Declration Block
	var _excpMsg;
	
	//Variable Initialization Block
	var _excpMsg = "Within fillSlicePlain(): \n";
	
	//Exception Handling Block
	try {	
		//Fill Slice
		//Set Color
		this._ctx.fillStyle = prm_color;
		//Fill Area
		this._ctx.fill();
	} catch (_excp) {
		//Set Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/**
 * function: fillSliceGradient
 * Objective:
	- Fills Slice With Gradient
 * Notes: Only 2 Or 3 COlors Are Supported
 */
PieChart.prototype.fillSliceGradient = function (prm_colors) {
	//Variable Declration Block
	var _gradient;
	var _excpMsg;
	
	//Variable Initialization Block
	var _excpMsg = "Within fillSliceGradient(): \n";
	
	//Exception Handling Block
	try {	
		//Create Gradient
		_gradient = this._ctx.createLinearGradient(0, 0, this._cnvElem.width, this._cnvElem.width);
		
		//Add Color Stops
		if (prm_colors.length == 2) {
			//Add Gradient Percents
			_gradient.addColorStop(0, prm_colors[0]);
			_gradient.addColorStop(1, prm_colors[1]);
		} else {
			//Add Gradient Percents
			_gradient.addColorStop(0, prm_colors[0]);
			_gradient.addColorStop(0.5, prm_colors[1]);
			_gradient.addColorStop(1, prm_colors[2]);
		}
		
		//Set Gradient
		this._ctx.fillStyle = _gradient;
		//Fill Area
		this._ctx.fill();
	} catch (_excp) {
		//Set Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}


/**
 * function: drawSliceBorder
 * Objective:
	- Draws Slice Border
 */
PieChart.prototype.drawSliceBorder = function (prm_width, prm_color) {
	//Variable Declration Block
	var _sliceBorder;
	var _excpMsg;
	
	//Variable Initialization Block
	var _excpMsg = "Within drawSliceBorder(): \n";
	
	//Exception Handling Block
	try {
		//Create Slice Border
		this._ctx.lineWidth = prm_width;//Get Border Width
		this._ctx.strokeStyle = prm_color;//Get Border Color
		this._ctx.stroke();//Complete Border
	} catch (_excp) {
		//Set Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/**
 * function: drawSliceShadow
 * Objective:
	- Draws Slice Border
 */
PieChart.prototype.drawShadow = function (prm_color) {
	//Variable Declration Block
	var _sliceBorder;
	var _excpMsg;
	
	//Variable Initialization Block
	var _excpMsg = "Within drawShadow(): \n";
	
	//Exception Handling Block
	try {
		//Create Shadow
		this._ctx.shadowColor = prm_color;
	} catch (_excp) {
		//Set Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/**
 * function: handleClick
 * Objective:
	- Handles Clicks On Chart
 * Notes:
	- Used Simple Circle Geometry
 */
PieChart.prototype.handleClick = function (prm_event, prm_elem) {
	//Variable Declaration Block
	var _clickAngle;
	var _clickX;
	var _clickY;
	var _distanceFromCenter;
	var _chartObject;
	var _val;
	var _excpMsg;
	
	//Variable Initialization Block
	_tempAngle = 0;
	_chartObject = this;
	_excpMsg = "Within handleClick(): \n";
	
	//Exception Handling Block
	try {
		//Get Click Co-ordinates
		_clickX = prm_event.clientX - (prm_elem.offsetLeft + this._centerX);
		_clickY = prm_event.clientY - (prm_elem.offsetTop + this._centerY);
		
		/*
		 * Verify If Click Point Is On The Chart
		 * Equation Of Circle Is Used
		 * (x-a)^2 + (y-b)^2 = r^2
		 * Get The Distance From Center
		 * If Distane From Center <= Radius, Clicked Within The Chart
		 * Else, Clicked Outside The Chart
		 */
		_distanceFromCenter = Math.sqrt(Math.pow(Math.abs(_clickX), 2) + Math.pow(Math.abs(_clickY), 2));
		
		//Execute Further Logic, If Clicked Within The Chart Only
		if (_distanceFromCenter <= this._radius) {
			//Clear Canvas To Redraw With Pulled Out Slice, Only If On Click Attribute Is Null
			if (this._dataParam[PieChart.c_s_KEY_ONCLICK] == null) {
				this.clear();
			}
			
			//Get Which Slice Is Clicked
			/*
			 * Get Click Angle
			 * Any point On Circle Area, Will Have The Following:
				tan(Click Angle) = y/x i.e. Click Angle = tan inverse(y/x)
			 */
			_clickAngle = Math.atan2(_clickY, _clickX);
			
			/*
			 * If Click Angle Is Less Than 0, Add 2 X PI To Get The Position
			 * __Since Negative X Position Will Return Return Negative tan Inverse Value
			 * __Adding 2 X PI Will Result The Angle To Be In Same Position Again With Positive Values
			 */
			if (_clickAngle < 0) {
				_clickAngle += 2 * Math.PI;
			}
			
			/*
			 * If On Click Attribute Is Defined, Execute The Custom Function
			   Else. Execute Pullout
			 */
			if (this._dataParam[PieChart.c_s_KEY_ONCLICK] == null) {//Click Action Is Not Defined
				/*
				 * If Animate Flag Is Set To True, Call animatePulloutslice Method,
				 * Else, pulloutSlice Method
				 */
				if (this._animate) {//Animate: True
					//Stop Any Previous Animation
					PieChart.stopAnimation()
					//Call Set Interval Method For Animation
					PieChart.c_i_INTERVAL_ID = setInterval(function () {
						PieChart.animatePulloutSlice(_chartObject, _clickAngle);
					}, 0.1);
				} else {//Animate: False
					//Pull Out Slice
					this.pulloutSlice(_clickAngle);
					/*
					 * If Pull Out Complete Action Is Defined, Execute Pullout Complete Action
					 */
					this.executeCustomActions(_clickAngle, PieChart.c_s_CUSTOM_ACTION_PULLOUTCOMPLETE);
				}
			} else {//Click Action Is Defined
				//Call Function To Execute Click Action
				this.executeCustomActions(_clickAngle, PieChart.c_s_CUSTOM_ACTION_CLICK);
			}
		} else {
			//Draw Chart
			this.drawChart();
		}
	} catch (_excp) {
		//Set Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/**
 * function: pulloutSlice
 * Objective:
	- Pulls Out The Selected Slice
 */
PieChart.prototype.pulloutSlice = function (prm_clickAngle, prm_pullOutDistance) {
	//Variable Declaration Block
	var _centerX;
	var _centerY;
	var _funcStr;
	var _pullAngle;
	var _pullOutDistance;
	var _tempAngle;
	var _tempObj;
	var _excpMsg;
	
	//Variable Initialization Block
	_tempAngle = 0;
	_excpMsg = "Within pulloutSlice(): \n";
	
	//Exception Handling Block
	try {
		//Clear Canvas To Redraw With Pulled Out Slice
		this.clear();
	
		/*
		 * If prm_pullOutDistance Is Null, Set To PieChart.c_n_PULLOUT_DISTANCE
		 * Else, Set To _pullOutDistance
		 */
		_pullOutDistance = (prm_pullOutDistance == null) ? PieChart.c_n_PULLOUT_DISTANCE : prm_pullOutDistance;
		
	
		//Execute Pull Out
		//Travese Through The Slices, To Check Which Slice Is Clicked
		for (var _idx = 0; _idx < this._data.length; _idx++) {
			//Get Object Into A Temporary Object
			_tempObj = this._data[_idx];
			
			//Get Value
			_val = _tempObj[PieChart.c_s_KEY_VAL];

			//Get Current Angle
			_currAngle = (2 * Math.PI) * (_val/this._sum);
			//Add Temp Angle To Get End Angle
			_currAngle = _currAngle + _tempAngle;
			
			//Execute Action For The Respective Slice
			if (_tempAngle <= prm_clickAngle && prm_clickAngle <= _currAngle) {
				//Get Pull Out Angle
				_pullAngle = (_tempAngle + _currAngle) / 2;
				
				//Move Center From Original Position
				_centerX = this._centerX + (Math.cos(_pullAngle) * _pullOutDistance);
				_centerY = this._centerY + (Math.sin(_pullAngle) * _pullOutDistance);
				
				//Draw Slice
				this.drawSlice(_tempAngle, _currAngle, _tempObj[PieChart.c_s_KEY_COLOR], _centerX, _centerY);
			} else {
				//Set To Global Object Property Values
				//This Is Set To Prevent Center Transformation While Animating.
				_centerX = this._centerX;
				_centerY = this._centerY;
				//Call Method To Draw Slice 
				this.drawSlice(_tempAngle, _currAngle, _tempObj[PieChart.c_s_KEY_COLOR]);
			}
			
			//Call Function To Draw Value Texts
			if (this._valuesObj[PieChart.c_s_KEY_VISIBLE] == null || this._valuesObj[PieChart.c_s_KEY_VISIBLE]) {
				this.drawValues(_val, _tempAngle, _currAngle, _centerX, _centerY);
			}
			
			//Call Function To Draw Legend
			this.drawLegend(_idx, _val, _tempObj[PieChart.c_s_KEY_LABEL], _tempObj[PieChart.c_s_KEY_COLOR][0]);
			
			//Set Temporary Angle For Next Iteration
			_tempAngle = _currAngle;
		}
	} catch (_excp) {
		//Set Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/**
 * function: executeCustomActions
 * Objective:
	- Executes Custom On Click Function
	- Finds The Slice Which Is Clicked
	- Passes The Corresponding Object To The Custom Action
 */
PieChart.prototype.executeCustomActions = function (prm_clickAngle, prm_action) {
	//Variable Declration Block
	var _tempObj;
	var _val;
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within executeCustomActions(): \n";
	
	//Exception Handling Block
	try {
		//Traverse Though The Data Values
		for (var _idx = 0; _idx < this._data.length; _idx++) {
			//Get The Temporary Object
			_tempObj = this._data[_idx];
			
			//Get Value
			_val = _tempObj[PieChart.c_s_KEY_VAL];

			//Get Current Angle
			_currAngle = (2 * Math.PI) * (_val/this._sum);
			//Add Temp Angle To Get End Angle
			_currAngle = _currAngle + _tempAngle;
			
			//Execute Action For The Slice Which Is Clicked
			if (_tempAngle <= prm_clickAngle && prm_clickAngle <= _currAngle) {
				//Call Custom Function, According To prm_action
				switch (prm_action) {
					case PieChart.c_s_CUSTOM_ACTION_CLICK:
						PieChart.onClick(_tempObj);
						break;
					case PieChart.c_s_CUSTOM_ACTION_PULLOUTCOMPLETE:
						PieChart.onPulloutComplete(_tempObj);
						break;
				}
			}
			
			//Set Temporary Angle For Next Iteration
			_tempAngle = _currAngle;
		}
	} catch (_excp) {
		//Set Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/**
 * function: clear
 * Objective:
	- Clears Canvas
 */
PieChart.prototype.clear = function () {
	//Variable Declration Block
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within clear(): \n";
	
	//Exception Handling Block
	try {
		this._ctx.clearRect(0, 0, this._cnvElem.width, this._cnvElem.height);
	} catch (_excp) {
		//Set Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}
//Pie Chart Object Ends

/****************************************************************
 ********************* Client Session ***************************
 ****************************************************************/
/**
 * Client Session Object
 */
function ClientSession () {}

//Member Functions Start
/**
 * function: get
 * Objective:
	- Gets Value From Session
 */
ClientSession.get = function (prm_key) {
	//Variable Declaration Block
	var _return;
	var _excp;
	
	//Variable Initialization Block
	_excpMsg = "Within get(): \n";
	
	//Exception Handling Block
	try {
		//If Key Exists, Set To Key Value, Else Set To Blank String
		_return = sessionStorage.setItem(prm_key);
		if (_return == null ) {//Set TO Null If Blank
			_return = "";
		}
	} catch (_excpMsg) {
		//Set Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
	
	//Return Statement
	return _return;
}

/**
 * function: set
 * Objective:
	- Sets Value From Session
 */
ClientSession.set = function (prm_key, prm_val) {
	//Variable Declaration Block
	var _excp;
	
	//Variable Initialization Block
	_excpMsg = "Within set(): \n";
	
	//Exception Handling Block
	try {
		//Set Item Value In Client session
		sessionStorage.setItem(prm_key, prm_val);
	} catch (_excpMsg) {
		//Set Exception Message
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}
//Member Functions End