<!--
  #File: File Uploader
  #Objective: Uploads And Processes File
  #Uses Image Processor File For Processing; Another PHP File In This Solution Contains The PHP Image Processor.
-->
<!-- HTML Code To Display Success Or Faliure Message -->
<html>
  <head>
  </head>
  <body>
    <?php
      //Include Image Processor
      include 'imageProcessor.php';

      //Variables
      //Allowed Extensions
      $allowedExts = array("jpeg", "jpg", "png");
      //Split Uploaded File Name With "." For Allowed Extension Verification
      $temp = explode(".", $_FILES["imgFile"]["name"]);
      //Get The Extension From The Split Array
      $extension = end($temp);

      //Get Entered Image Dimensions From Request Parameters
      $imgWidth = $_POST["imgWidth"];
      $imgHeight = $_POST["imgHeight"];

      //File Upload Functionality
      //Validate Extensions And Proceed With Uploading; Else Display Invalid File Error
      if ((($_FILES["imgFile"]["type"] == "image/jpeg")
        || ($_FILES["imgFile"]["type"] == "image/jpg")
        || ($_FILES["imgFile"]["type"] == "image/png"))
        && in_array($extension, $allowedExts)) {//Valid Extension
          //If File Upload Throws Error Display Error Message; Else Upload To Designated Folder
          if ($_FILES["imgFile"]["error"] > 0) {//Error
            echo "Return Code: " . $_FILES["imgFile"]["error"] . "<br>";
          } else {//Upload To Temp And Move To Designated Folder
            //Move Uploaded File To Designated Folder
            move_uploaded_file($_FILES["imgFile"]["tmp_name"], $_FILES["imgFile"]["name"]);
            /**
             * Call Function To Process Thumbnail; 
             * Return Value For Function Will Be Link To Function
             */
            $thumbnailLink =& processImage($_FILES["imgFile"]["name"], $imgWidth, $imgHeight);
            //Print Link To Created Thumbnail
            echo "<a href='" . $thumbnailLink . "'>Click here to view thumbnail</a>";
          }
      } else {//Invalid File Upload Attempt
        echo "Invalid file";
      }
    ?>
  </body>
<html>