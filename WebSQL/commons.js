/**
 * File: commons.js
 * Objective:
  - Contains All Database Statements
	- Handles All Database Statements
 * Author: KC
 * Creation Date: 03/14/2013
 * Revision History:
 	----------------------------------------------------------------------------------------
 	Date     | Modification          | Modifier | Version | Comments
 	----------------------------------------------------------------------------------------
 	20130314 | Initial Version       | KC  | 1.0     |
 	----------------------------------------------------------------------------------------
 */
/***********************************************
 *********** StringHandler Object **************
 ***********************************************/
/*
 * StringHandler Object
 	- Handles String Operations
 	- Functions Not Directly Available In Javascript API Are Added Here  
 */
function StringHandler () {}

//Static Methods - Start
/*
 * Function: StringHandler.replace
 * Objective:
 	- Replaces All Occurence Of A String From A String With New String 
 * Parameters:
  	prm_sString   - String Containing Parameters
  	prm_sOldValue - String Which Is To Be Replaced
  	prm_sNewValue - String Which Will Be Replaced 
 */

StringHandler.replace = function (prm_sString, prm_sOldValue, prm_sNewValue) {
	//Variable Declaration
	var _sReturn = prm_sString;
	
	/*
	 * Replaces All Old String Occurences With New String
	 * Regular Expression Used To Replace All Values From A String
	 */
	_sReturn = _sReturn.replace(new RegExp(prm_sOldValue, 'g'), prm_sNewValue);
	
	//Return String
	return _sReturn;
}

/*
 * Function: StringHandler.replaceMultiple
 * Objective:
 	- Replaces Multiple Values From A String
 	- Values Must Be Specified In String Like
 		prm_0, prm_1
 	- prm_<n> Will get Replaced By n Index Of Array
 * Parameters:
  	prm_sString   - String Containing Parameters
  	prm_arrValues - Value Array
 */

StringHandler.replaceMultiple = function (prm_sString, prm_arrValues) {
	//Variable Declaration
	var _sReturn = prm_sString;
	
	//Traverse Through Array To Apply Parameters
	for (_idx = 0; _idx < prm_arrValues.length; _idx++) {
		/*
		 * Replace Value With All PlaceHolder Occurences
		 * Regular Expression Used To Replace All Values From A String
		 */
		_sReturn = _sReturn.replace(new RegExp("prm_" + _idx, 'g'), prm_arrValues[_idx]);
	}
	
	//Return String
	return _sReturn;
}

/*
 * Function: substringAfter
 * Objective:
 	- Returns String After The Supplied The SubString
 	- if The Supplied Substring Appears More Than Once In the String
 	  Function Will Return The Value After The Last Occurence 
 * Parameters:
 	prm_sString     - Main String On Which Substring Is To Be Applied
 	prm_sStringPart - String Part After Which Substring Is To Be Done
 */
StringHandler.substringAfter = function (prm_sString, prm_sStringPart) {
	//Variable Declaration Block
	var _sReturn;
	
	//Exception Handling Block
	try {
		/*
		 * If String Part Exists In The Main String, Display Execute Logic
		 * Else, throw Exception
		 */
		if (prm_sString.indexOf(prm_sStringPart) >= 0) {
			/*
			 * Get Substring After String Part
			 * Sample:
			   Main String abc12345, String Part abc
			   Substring After String Part
			      Last Occurence Of String Part (0) + Length Of String Part (3) = Starting Index At 3, Starting From 0 As Index   
			 */
			_sReturn = prm_sString.substring(prm_sString.lastIndexOf(prm_sStringPart) + prm_sStringPart.length);
		} else {
			throw Message.c_s_STRING_PART_DOES_NOT_EXIST;
		}
	} catch (_excp) {
		//Display Message
		Message.displayMessage("Exception Within StringHandler.substringAfter:\n" + _excp, Message.c_s_MESSAGE_TYPE_EXCEPTION);
	}
	
	//Return Statement
	return _sReturn;
}

/*
 * Function: substringBefore
 * Objective:
 	- Returns String Before The Supplied The SubString
 	- if The Supplied Substring Appears More Than Once In the String
 	  Function Will Return The Value Before The First Occurence 
 * Parameters:
 	prm_sString     - Main String On Which Substring Is To Be Applied
 	prm_sStringPart - String Part Before Which Substring Is To Be Done
 */
StringHandler.substringBefore = function (prm_sString, prm_sStringPart) {
	//Variable Declaration Block
	var _sReturn;
	
	//Exception Handling Block
	try {
		/*
		 * If String Part Exists In The Main String, Display Execute Logic
		 * Else, throw Exception
		 */
		if (prm_sString.indexOf(prm_sStringPart) >= 0) {
			/*
			 * Get Substring After String Part
			 * Sample:
			   Main String 12345abc, String Part abc
			   Substring Before String Part
			      First Occurence Of String Part (6) - 1 = Ending Index At 0, Starting From 0 As Index   
			 */
			_sReturn = prm_sString.substring(0, (prm_sString.indexOf(prm_sStringPart) - 1));
		} else {
			throw Message.c_s_STRING_PART_DOES_NOT_EXIST;
		}
	} catch (_excp) {
		//Display Message
		Message.displayMessage("Exception Within StringHandler.substringAfter:\n" + _excp, Message.c_s_MESSAGE_TYPE_EXCEPTION);
	}
	
	//Return Statement
	return _sReturn;
}
//Static Methods - End

//Commands:
var demo_table_ins = 'INSERT INTO "main"."DEMO_TABLE" ("CODE","NAME","DESC") VALUES (?,?,?)';
var demo_table_ins1 = 'INSERT INTO "main"."DEMO_TABLE" ("CODE","NAME","DESC") VALUES ("TST1","TEST 1","This is a test 1")';
var demo_table1_ins1 = 'INSERT INTO "main"."DEMO_TABLE1" ("CODE","NAME","DESC") VALUES ("TST1","TEST 1","This is a test 1")';
var _demo_table_select = "SELECT * FROM DEMO_TABLE";
