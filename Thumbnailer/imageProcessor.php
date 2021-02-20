<!--
  #File: Image Processor
  #Objective: Processes Image And Creates Thumbnail
  #Arguments:
    imageFileName - Large Image File Name
    imageFileWidth - Thumbnail Image Width; In Pixels
    imageFileHeight - Thumbnail Image Height; In Pixels
  #Return:
    thmbnailFilename - Thumbnail File Path
-->
<?php
  function processImage ($imageFileName, $thumbnailWidth, $imageFileHeight) {
    //Variables
    //Split File Name By "."
    $fileNameParts = explode(".", $imageFileName);
    //Get The Keys From File Name Parts
    $keys = array_keys($fileNameParts);
    /*
     * Create Thumbnail File Name
     * File Name Will Be Like:
        - <File Name Without Extension>_thumb.<File Extension>
     */
    $thmbnailFilename = $fileNameParts[$keys[0]] . "_thumb." . $fileNameParts[$keys[1]];

    //Get New Dimensions
    list($origWidth, $origHeight) = getimagesize($imageFileName);

    //Resample With New Dimensions As Entered
    $imageProcessed = imagecreatetruecolor($thumbnailWidth, $imageFileHeight);
    $image = imagecreatefromjpeg($imageFileName);
    imagecopyresampled($imageProcessed, $image, 0, 0, 0, 0, $thumbnailWidth, $imageFileHeight, $origWidth, $origHeight);

    //Create Output And Copy To Same Folder As Original Image
    imagejpeg($imageProcessed, $thmbnailFilename, 100);

    //Return File Path
    return $thmbnailFilename;
  }
?>