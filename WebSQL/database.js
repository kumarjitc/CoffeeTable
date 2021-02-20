/**
 * File: database.js
 * Objective: To Handle Database Transactions
 * Author: KC
 * Creation Date: 04/10/2012
 * Revision History:
   ----------------------------------------------------------------------------------------
 	Date     | Modification          | Modifier | Version | Comments
 	----------------------------------------------------------------------------------------
 	20130314 | Initial Version       | KC       | 1.0     |
 	----------------------------------------------------------------------------------------
 */

/***********************************************
 ******* Database Configuration Object *********
 ***********************************************/
//Contains Configuration Value
function DBConfig() {}

//Static Object Properties - Start
DBConfig.c_NAME = "SAMPLE_DB";//Database Name
DBConfig.c_VERSION = "1.0";//Database Version
DBConfig.c_DESCRIPTION = "SAMPLE DATA BASE FOR PAGE";//Database Display Name
DBConfig.c_SIZE = "200000";//Database Size
//Static Object Properties - End
//DBConfig Object Ends



/***********************************************
 ******** Database Connection Object ***********
 ***********************************************/
//Creates Connection With Database 
function DBConnection() {
	this.g_oDB = null;//Database Object
	this._init();//Constructor
}

//Member Methods Start
/**
 * Constructor
 	- Creates Initial Connection With Local DB 
 */
DBConnection.prototype._init = function() {
	//Variable Declaration Block
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within DBConnection.prototype._init()";
	
	try {
		/**
		 * Some Browsers Do Not Support Web SQL
		 * E.g - Firefox, IE7-
		 * Display Appropiate Error for them.
		 */
		if (window.openDatabase) {
			//Open Database
			this.g_oDB = openDatabase(DBConfig.c_NAME, DBConfig.c_VERSION, DBConfig.c_DESCRIPTION, DBConfig.c_SIZE);
		} else {
			//Display Error
			alert("Web SQL Is Not supported In Your Browser.");
		}
	} catch (_excp) {
		//Append Exception
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/**
 * getDBConnection (Member Method) of DBConnection Object
 */
DBConnection.prototype.getDBConnection = function() {
	return this.g_oDB;
}

/**
 * Shutdown
 Objective: 
 - Destroy g_oDB Object
 */
DBConnection.prototype.shutdown = function() {
	this.g_oDB = null;
}
//Member Methods - End

//Static Methods - Start
/**
 * getDBConnection (Static Method) of DBConnection Object
 * Objective:
	- Returns g_oDB Value
 */
DBConnection.getDBConnection = function() {
	//Variable Declaration Block
	var _oDBConn = null;
	var _return = null;
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within DBConnection.getDBConnection()";
	
	try {
		//Create DBConnection Type Object
		_oDBConn = new DBConnection();
		//Get DB Connection
		_return = _oDBConn.getDBConnection();
	} catch (_excp) {
		//Append Exception
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
	
	//Return Statement
	return _return;
}

//Static Methods - End
//DBConnection Object Ends

/***********************************************
 ******** Database Transaction Object **********
 ***********************************************/
//Executes Database Transaction
function DBTransaction () {
	this.g_arrVal = [];
	this.g_oDB;
	this._init();
}

//Member Methods - Start
/**
 * Constructor
 * Objective:
 	- Gets The Value Of g_oDB
 */
DBTransaction.prototype._init = function () {
	//Variable Declaration Block
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within DBTransaction.prototype._init()";
	
	//Exception Handling Block
	try {
		//Get COnnection
		this.g_oDB = DBConnection.getDBConnection();
	} catch (_excp) {
		//Append Exception
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}
	
/**
 * executeUpdate Member method
 * Objective:
	- Executes DDL, DML Statements
 */
DBTransaction.prototype.executeUpdate = function(prm_sStmt, prm_arrVal) {
	//Variable Declaration Block
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within DBTransaction.prototype.executeUpdate()";
	
	//Exception Handling Block
	try {
		//Execute Transaction
		this.g_oDB.transaction(function(_txn) {
			//Executes Query With The Parameters Values
			_txn.executeSql(prm_sStmt, prm_arrVal, DBTransaction.onSuccess, DBTransaction.onError);
		});
	} catch(_excp) {
		//Append Exception
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/**
 * executeUpdateBatch Member Method
 * Objective :
 	- Executes Multiple DDL/DML Statements Statements
 */
DBTransaction.prototype.executeUpdateBatch = function(prm_arrStmt) {
	//Variable Declaration Block
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within DBTransaction.prototype.executeUpdateBatch()";
	
	//Exception Handling Block
	try {
		//Initialize Statement Arrays
		DBTransaction.c_arr_STMT = prm_arrStmt;
		
		//Execute Transaction
		this.g_oDB.transaction(function (_txn) {
			//Traverse Througgh The Statement Array; Execute Statements
			for (var _i = 0; _i < (DBTransaction.c_arr_STMT).length; _i++) {
				//Execute Statements
				_txn.executeSql(DBTransaction.c_arr_STMT[_i]);
			}
		}, DBTransaction.onError, DBTransaction.onSuccess);
	} catch(_excp) {
		//Append Exception
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}
	
/**
 * executeQuery Member Method
 * Objective :
 	- Executes Select Statements
 */
DBTransaction.prototype.executeQuery = function (prm_sSelQry, prm_arrVal) {
	//Variable Declaration Block
	var _return = 0;
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within DBTransaction.prototype.executeQuery()";
	
	//Exception Handling Block
	try {
		//Execute Transaction
		this.g_oDB.transaction(function (_txn) {
			//Executes Query With The Parameters Values
			 _txn.executeSql(prm_sSelQry, prm_arrVal, DBTransaction.onSuccessExecQuery, DBTransaction.onErrorExecQuery);
		});
	} catch(_excp) {
		//Append Exception
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
	
	//Return Statement
	return _return;
}

	
/**
 * shutdown Method
 * Objective : 
 	- Destroys The Objects 
 */
DBTransaction.prototype.shutdown = function () {
	//Set Variables To Null
	this.g_arrVal = null;
	this.g_oDB = null;
}
//Member Methods End

//Static Properties Start
DBTransaction.c_arr_STMT;
DBTransaction.c_i_IDX = 0;
DBTransaction.c_b_EXEC_COMPLETE = false;
//Static Properties End

//Static Methods Start
/**
 * Function: executeDDLBatch
 * Objective:
 	- Calls the ExecuteDDL Static Method Repeatedly By Passing The Array Elements(For Multiple Tables). 
 */
DBTransaction.executeDDLBatch = function (prm_arrStmt) {
	//Variable Declaration Block
	var _oDBTxn;
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within DBTransaction.executeDDLBatch()";
	
	//Exception Handling Block
	try {
		//Creates Object Of Type DBTransaction.
		_oDBTxn = new DBTransaction();
		//Call executeUpdateBatch Function Execute DDL Statements
		_oDBTxn.executeUpdateBatch(prm_arrStmt);
	} catch(_excp) {
		//Append Exception
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/**
 * Function: executeDDL
 * Objective:
 	- Calls executeUpdate Member Method .
 */
DBTransaction.executeDDL = function (prm_sStmt) {
	//Variable Declaration Block
	var _oDBTxn;
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within DBTransaction.executeDDL()";
	
	//Exception Handling Block
	try {
		//Creation Of Object Of DBTransaction Type
		_oDBTxn = new DBTransaction();
		//Calls executeUpdate Member Method
		_oDBTxn.executeUpdate(prm_sStmt, []);
	} catch (_excp) {
		//Append Exception
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/**
 * Function: executeDMLMultiStmt
 * Objective:
	- Calls the ExecuteDML Static Method Repeatedly By Passing
 	  Array Elements(For Multiple Statements With Value).
 	- prm_arrStmt Will Contain Multiple Statements
 */
DBTransaction.executeDMLBatch = function (prm_arrStmt) {
	//Variable Declaration Block
	var _oDBTxn;
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within DBTransaction.executeDMLBatch()";
	
	//Exception Handling Block
	try {
		//Creates Object Of Type DBTransaction.
		_oDBTxn = new DBTransaction();
		//Call executeUpdateBatch Function Execute DDL Statements
		_oDBTxn.executeUpdateBatch(prm_arrStmt);
	} catch (_excp) {
		//Append Exception
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}


/**
 * Function: executeDMLMultiValueBatch
 * Objective:
	- Calls the ExecuteDML Static Method Repeatedly By Passing
	  Array Elements(For Single Statement With Multiple Value).
	- prm_arrValues Will Contain Array Of Arrays
	  Each Array In prm_arrValues Will Contain Values To Be Inserted
 */
DBTransaction.executeDMLMultiValueBatch = function (prm_sStmt, prm_arrValues) {
	//Variable Declaration Block
	var _iIdx = 0;
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within DBTransaction.executeDMLMultiValueBatch()";
			
	//Exception Handling Block
	try{
		// For Loop To Pass Each Element Of Array in The ExecuteDML Method.
		for (_iIdx = 0; _iIdx < prm_arrValues.length; _iIdx++) {
			//Call Funciton To Exec DML
			DBTransaction.executeDML(prm_sStmt, prm_arrValues[_iIdx]);
		}
	} catch (_excp) {
		//Append Exception
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/**
 * Function: executeDML
 * Objective :
 	- Calls executeUpdate Member Method .
 */
DBTransaction.executeDML = function(prm_sStmt, prm_arrVal) {
	//Variable Decalration Block
	var _oDBTxn;
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within DBTransaction.executeDML()";
	
	//Exception Handling Block
	try {
		//Creates Object Of Type DBTransaction.
		_oDBTxn = new DBTransaction();
		//Calls executeUpdate Member Method 
		_oDBTxn.executeUpdate(prm_sStmt, prm_arrVal);
	} catch (_excp) {
		//Append Exception
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}


/**
 * executeQuery Static Method
 Objective : 
 - Execute Statements
 */
DBTransaction.executeQuery = function(prm_sSelQry, prm_arrVal) {
	//Variable Decalration Block
	var _oDBTxn;
	var _excpMsg;
	
	//Variable Initialization Block
	_excpMsg = "Within DBTransaction.executeQuery()";
	
	//Exception Handling Block
	try {
		//Creates Object Of Type DBTransaction.
		_oDBTxn = new DBTransaction();
		//Execute Query
		_oDBTxn.executeQuery(prm_sSelQry, prm_arrVal);
	} catch (_excp) {
		//Append Exception
		_excpMsg += _excp;
		//Display Message
		alert(_excpMsg);
	}
}

/**
 * Function: onSuccessExecQuery
 */
DBTransaction.onSuccessExecQuery = function (prm_txn, prm_oRecSet) {
	//Method Stub To Get Overridden By User
}


/**
 * Function: onSuccess
	- Objective :
	- Shows On Success Call Back
 */
DBTransaction.onSuccess = function() {
	//Method Stub To Get Overridden By User
}
	
/**
 * Function: onErrorExecQuery 
 * Objective :
	- Shows On Error Call Back
*/
DBTransaction.onErrorExecQuery = function (prm_txn, prm_Error) {
	//Display Error Message
	alert("Database Error Occurred\n" + prm_Error.message);
}

/**
 * Function: onError
 * Objective :
	- Shows On Error Call Back
*/
DBTransaction.onError = function (prm_txn, prm_Error) {
	//Display Error Message
	alert("Database Error Occurred\n" + prm_Error.message);
}

/**
 * Function: passBackBlankStub 
 * Objective :
	- Shows On Error Call Back
*/
DBTransaction.passBackBlankStub = function() {
	//Pass Back For DBTransaction.onSuccessExecQuery
	DBTransaction.onSuccessExecQuery = function (prm_txn, prm_oRecSet) {
		//Method Stub To Get Overridden By User
	};
	
	//Pass Back For DBTransaction.onSuccess
	DBTransaction.onSuccess = function() {
		//Method Stub To Get Overridden By User
	};
}
//Static Methods End
//DBTransaction Object - Ends

/***********************************************
 ********* Database Statements Object **********
 ***********************************************/
//Database Statement Object
function DBStatement () {} 
//Static Object Properties - Start

//Static Methods - Start
DBStatement.applyParamToQuery = function (prm_sQuery, prm_arrParams) {
	return StringHandler.replaceMultiple(prm_sQuery, prm_arrParams);
}
//Static Methods - End
//DBStatement Object - Ends
