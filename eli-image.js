
	var imgfields = document.querySelectorAll('.imgoptimize');	
	if(imgfields.length > 0){
	//console.log(imgfields.length);
	imgfields.forEach(function(item){
		item.addEventListener('change',async function(e){			
			var field = e.target;			
			var maxwidth = field.getAttribute('maxwidth');
			var quality = field.getAttribute('quality');
			var exportimgtype = field.getAttribute('exportimgtype');
			var preview = field.getAttribute('preview');
			var textarea = field.getAttribute('data');
			// resetting 
			//alert(item.files.length);
			document.querySelector(textarea).innerHTML = "";
			document.querySelector(preview).innerHTML = "";
			//alert("passed");
			//console.log(item.files);
			for (var i = item.files.length - 1; i >= 0; i--) {
				//console.log(item.files[i]);
				// -- Making Dataurl -- //
				file = item.files[i];
				
				EXIF.getData(file);

		 		var optimg = await optimizeImg(file,{
		 			'maxwidth':maxwidth || '600px',
		 			'imgquality': quality || 60,
		 			'imgtype': exportimgtype || 'image/png',
		 			'preview': preview || '',
		 			'textarea': textarea || ''
		 		},function(optimg,options,file){
		 			//console.log(options.preview);
		 			if(options.preview){
		 				var previewbox = document.querySelector(preview);
						previewbox.insertAdjacentHTML("beforeend","<img src='"+optimg+"' alt='optimized'>");
		 			}
		 			// add the dataurl (optimg) in json and put that json inside the textarea
		 			

		 			var inputfieldjson = { 'name':file.name, 'data':optimg, 'type':options.imgtype, 'exifdata':file.exifdata };
		 			jsoninputfile(options.textarea,inputfieldjson);
		 			//console.log(inputfieldjson);
		 		});	
				//// 												
			}
			// console.log(item.files.length);
		})
	})
}

function optimizeImg(file,options,callback){

	options = options || "";

	imgtype = options.imgtype || "image/jpeg";
	imgquality = options.imgquality || 60;	

	if(!file) return "file not exist";

	const reader = new FileReader();
	reader.readAsDataURL(file);

	reader.onload = function(event){
		const imgElement = document.createElement("img");		
		imgElement.src = event.target.result;
		// breakpoint: here you can show preview
		
		imgElement.onload = function(e){			
			const canvas = document.createElement("canvas");
			// Max Width
			const MAX_WIDTH = options.maxwidth || 400;

			// Ratio
			const scaleSize = MAX_WIDTH / e.target.width;
			canvas.width = MAX_WIDTH;
			canvas.height = e.target.height * scaleSize;

			// 2D
			const ctx = canvas.getContext("2d");
			ctx.drawImage(e.target, 0,0, canvas.width, canvas.height);
			const srcEncoded = ctx.canvas.toDataURL(e.target,imgtype); // optimization takes place			

			//document.querySelector('.previewbox').insertAdjacentHTML("beforeend","<img src='"+srcEncoded+"' alt='optimized'>");
			if(callback){
				callback(srcEncoded,options,file);
			}

			//return srcEncoded;		
		}
	}

}

function jsoninputfile(textarea,jsondata){
	var txtar = document.querySelector(textarea);
	if(txtar){
		if(typeof jsondata == 'object'){
			jsondata = JSON.stringify(jsondata);
		}
		var olddata = txtar.innerHTML;
		if(olddata){
			document.querySelector(textarea).innerHTML = olddata+","+jsondata;	
			//var od = document.querySelector(textarea).innerHTML;
			//console.log(JSON.parse("["+od+"]"));
		}
		else
		{
			document.querySelector(textarea).innerHTML = jsondata;
		}
	}
	else
	{
		console.error('Eli:Please specify a textarea id as data attribute in the form with '+textarea);
	}
}

/**
 * Original file: /npm/exif-js@2.3.0/exif.js
 * 
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
(function(){var d=!1,l=function(e){return e instanceof l?e:this instanceof l?void(this.EXIFwrapped=e):new l(e)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=l),exports.EXIF=l):this.EXIF=l;var u=l.Tags={36864:"ExifVersion",40960:"FlashpixVersion",40961:"ColorSpace",40962:"PixelXDimension",40963:"PixelYDimension",37121:"ComponentsConfiguration",37122:"CompressedBitsPerPixel",37500:"MakerNote",37510:"UserComment",40964:"RelatedSoundFile",36867:"DateTimeOriginal",36868:"DateTimeDigitized",37520:"SubsecTime",37521:"SubsecTimeOriginal",37522:"SubsecTimeDigitized",33434:"ExposureTime",33437:"FNumber",34850:"ExposureProgram",34852:"SpectralSensitivity",34855:"ISOSpeedRatings",34856:"OECF",37377:"ShutterSpeedValue",37378:"ApertureValue",37379:"BrightnessValue",37380:"ExposureBias",37381:"MaxApertureValue",37382:"SubjectDistance",37383:"MeteringMode",37384:"LightSource",37385:"Flash",37396:"SubjectArea",37386:"FocalLength",41483:"FlashEnergy",41484:"SpatialFrequencyResponse",41486:"FocalPlaneXResolution",41487:"FocalPlaneYResolution",41488:"FocalPlaneResolutionUnit",41492:"SubjectLocation",41493:"ExposureIndex",41495:"SensingMethod",41728:"FileSource",41729:"SceneType",41730:"CFAPattern",41985:"CustomRendered",41986:"ExposureMode",41987:"WhiteBalance",41988:"DigitalZoomRation",41989:"FocalLengthIn35mmFilm",41990:"SceneCaptureType",41991:"GainControl",41992:"Contrast",41993:"Saturation",41994:"Sharpness",41995:"DeviceSettingDescription",41996:"SubjectDistanceRange",40965:"InteroperabilityIFDPointer",42016:"ImageUniqueID"},c=l.TiffTags={256:"ImageWidth",257:"ImageHeight",34665:"ExifIFDPointer",34853:"GPSInfoIFDPointer",40965:"InteroperabilityIFDPointer",258:"BitsPerSample",259:"Compression",262:"PhotometricInterpretation",274:"Orientation",277:"SamplesPerPixel",284:"PlanarConfiguration",530:"YCbCrSubSampling",531:"YCbCrPositioning",282:"XResolution",283:"YResolution",296:"ResolutionUnit",273:"StripOffsets",278:"RowsPerStrip",279:"StripByteCounts",513:"JPEGInterchangeFormat",514:"JPEGInterchangeFormatLength",301:"TransferFunction",318:"WhitePoint",319:"PrimaryChromaticities",529:"YCbCrCoefficients",532:"ReferenceBlackWhite",306:"DateTime",270:"ImageDescription",271:"Make",272:"Model",305:"Software",315:"Artist",33432:"Copyright"},f=l.GPSTags={0:"GPSVersionID",1:"GPSLatitudeRef",2:"GPSLatitude",3:"GPSLongitudeRef",4:"GPSLongitude",5:"GPSAltitudeRef",6:"GPSAltitude",7:"GPSTimeStamp",8:"GPSSatellites",9:"GPSStatus",10:"GPSMeasureMode",11:"GPSDOP",12:"GPSSpeedRef",13:"GPSSpeed",14:"GPSTrackRef",15:"GPSTrack",16:"GPSImgDirectionRef",17:"GPSImgDirection",18:"GPSMapDatum",19:"GPSDestLatitudeRef",20:"GPSDestLatitude",21:"GPSDestLongitudeRef",22:"GPSDestLongitude",23:"GPSDestBearingRef",24:"GPSDestBearing",25:"GPSDestDistanceRef",26:"GPSDestDistance",27:"GPSProcessingMethod",28:"GPSAreaInformation",29:"GPSDateStamp",30:"GPSDifferential"},g=l.IFD1Tags={256:"ImageWidth",257:"ImageHeight",258:"BitsPerSample",259:"Compression",262:"PhotometricInterpretation",273:"StripOffsets",274:"Orientation",277:"SamplesPerPixel",278:"RowsPerStrip",279:"StripByteCounts",282:"XResolution",283:"YResolution",284:"PlanarConfiguration",296:"ResolutionUnit",513:"JpegIFOffset",514:"JpegIFByteCount",529:"YCbCrCoefficients",530:"YCbCrSubSampling",531:"YCbCrPositioning",532:"ReferenceBlackWhite"},m=l.StringValues={ExposureProgram:{0:"Not defined",1:"Manual",2:"Normal program",3:"Aperture priority",4:"Shutter priority",5:"Creative program",6:"Action program",7:"Portrait mode",8:"Landscape mode"},MeteringMode:{0:"Unknown",1:"Average",2:"CenterWeightedAverage",3:"Spot",4:"MultiSpot",5:"Pattern",6:"Partial",255:"Other"},LightSource:{0:"Unknown",1:"Daylight",2:"Fluorescent",3:"Tungsten (incandescent light)",4:"Flash",9:"Fine weather",10:"Cloudy weather",11:"Shade",12:"Daylight fluorescent (D 5700 - 7100K)",13:"Day white fluorescent (N 4600 - 5400K)",14:"Cool white fluorescent (W 3900 - 4500K)",15:"White fluorescent (WW 3200 - 3700K)",17:"Standard light A",18:"Standard light B",19:"Standard light C",20:"D55",21:"D65",22:"D75",23:"D50",24:"ISO studio tungsten",255:"Other"},Flash:{0:"Flash did not fire",1:"Flash fired",5:"Strobe return light not detected",7:"Strobe return light detected",9:"Flash fired, compulsory flash mode",13:"Flash fired, compulsory flash mode, return light not detected",15:"Flash fired, compulsory flash mode, return light detected",16:"Flash did not fire, compulsory flash mode",24:"Flash did not fire, auto mode",25:"Flash fired, auto mode",29:"Flash fired, auto mode, return light not detected",31:"Flash fired, auto mode, return light detected",32:"No flash function",65:"Flash fired, red-eye reduction mode",69:"Flash fired, red-eye reduction mode, return light not detected",71:"Flash fired, red-eye reduction mode, return light detected",73:"Flash fired, compulsory flash mode, red-eye reduction mode",77:"Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",79:"Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",89:"Flash fired, auto mode, red-eye reduction mode",93:"Flash fired, auto mode, return light not detected, red-eye reduction mode",95:"Flash fired, auto mode, return light detected, red-eye reduction mode"},SensingMethod:{1:"Not defined",2:"One-chip color area sensor",3:"Two-chip color area sensor",4:"Three-chip color area sensor",5:"Color sequential area sensor",7:"Trilinear sensor",8:"Color sequential linear sensor"},SceneCaptureType:{0:"Standard",1:"Landscape",2:"Portrait",3:"Night scene"},SceneType:{1:"Directly photographed"},CustomRendered:{0:"Normal process",1:"Custom process"},WhiteBalance:{0:"Auto white balance",1:"Manual white balance"},GainControl:{0:"None",1:"Low gain up",2:"High gain up",3:"Low gain down",4:"High gain down"},Contrast:{0:"Normal",1:"Soft",2:"Hard"},Saturation:{0:"Normal",1:"Low saturation",2:"High saturation"},Sharpness:{0:"Normal",1:"Soft",2:"Hard"},SubjectDistanceRange:{0:"Unknown",1:"Macro",2:"Close view",3:"Distant view"},FileSource:{3:"DSC"},Components:{0:"",1:"Y",2:"Cb",3:"Cr",4:"R",5:"G",6:"B"}};function i(e){return!!e.exifdata}function r(i,o){function t(e){var t=p(e);i.exifdata=t||{};var n=function(e){var t=new DataView(e);d&&console.log("Got file of length "+e.byteLength);if(255!=t.getUint8(0)||216!=t.getUint8(1))return d&&console.log("Not a valid JPEG"),!1;var n=2,r=e.byteLength;for(;n<r;){if(l=n,56===(s=t).getUint8(l)&&66===s.getUint8(l+1)&&73===s.getUint8(l+2)&&77===s.getUint8(l+3)&&4===s.getUint8(l+4)&&4===s.getUint8(l+5)){var i=t.getUint8(n+7);i%2!=0&&(i+=1),0===i&&(i=4);var o=n+8+i,a=t.getUint16(n+6+i);return S(e,o,a)}n++}var s,l}(e);if(i.iptcdata=n||{},l.isXmpEnabled){var r=function(e){if(!("DOMParser"in self))return;var t=new DataView(e);d&&console.log("Got file of length "+e.byteLength);if(255!=t.getUint8(0)||216!=t.getUint8(1))return d&&console.log("Not a valid JPEG"),!1;var n=2,r=e.byteLength,i=new DOMParser;for(;n<r-4;){if("http"==y(t,n,4)){var o=n-1,a=t.getUint16(n-2)-1,s=y(t,o,a),l=s.indexOf("xmpmeta>")+8,u=(s=s.substring(s.indexOf("<x:xmpmeta"),l)).indexOf("x:xmpmeta")+10;s=s.slice(0,u)+'xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:tiff="http://ns.adobe.com/tiff/1.0/" xmlns:plus="http://schemas.android.com/apk/lib/com.google.android.gms.plus" xmlns:ext="http://www.gettyimages.com/xsltExtension/1.0" xmlns:exif="http://ns.adobe.com/exif/1.0/" xmlns:stEvt="http://ns.adobe.com/xap/1.0/sType/ResourceEvent#" xmlns:stRef="http://ns.adobe.com/xap/1.0/sType/ResourceRef#" xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/" xmlns:xapGImg="http://ns.adobe.com/xap/1.0/g/img/" xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/" '+s.slice(u);var c=i.parseFromString(s,"text/xml");return x(c)}n++}}(e);i.xmpdata=r||{}}o&&o.call(i)}var e,n,r;if(i.src)if(/^data\:/i.test(i.src))t(function(e,t){t=t||e.match(/^data\:([^\;]+)\;base64,/im)[1]||"",e=e.replace(/^data\:([^\;]+)\;base64,/gim,"");for(var n=atob(e),r=n.length,i=new ArrayBuffer(r),o=new Uint8Array(i),a=0;a<r;a++)o[a]=n.charCodeAt(a);return i}(i.src));else if(/^blob\:/i.test(i.src)){(s=new FileReader).onload=function(e){t(e.target.result)},e=i.src,n=function(e){s.readAsArrayBuffer(e)},(r=new XMLHttpRequest).open("GET",e,!0),r.responseType="blob",r.onload=function(e){200!=this.status&&0!==this.status||n(this.response)},r.send()}else{var a=new XMLHttpRequest;a.onload=function(){if(200!=this.status&&0!==this.status)throw"Could not load image";t(a.response),a=null},a.open("GET",i.src,!0),a.responseType="arraybuffer",a.send(null)}else if(self.FileReader&&(i instanceof self.Blob||i instanceof self.File)){var s;(s=new FileReader).onload=function(e){d&&console.log("Got file of length "+e.target.result.byteLength),t(e.target.result)},s.readAsArrayBuffer(i)}}function p(e){var t=new DataView(e);if(d&&console.log("Got file of length "+e.byteLength),255!=t.getUint8(0)||216!=t.getUint8(1))return d&&console.log("Not a valid JPEG"),!1;for(var n,r=2,i=e.byteLength;r<i;){if(255!=t.getUint8(r))return d&&console.log("Not a valid marker at offset "+r+", found: "+t.getUint8(r)),!1;if(n=t.getUint8(r+1),d&&console.log(n),225==n)return d&&console.log("Found 0xFFE1 marker"),o(t,r+4,t.getUint16(r+2));r+=2+t.getUint16(r+2)}}var h={120:"caption",110:"credit",25:"keywords",55:"dateCreated",80:"byline",85:"bylineTitle",122:"captionWriter",105:"headline",116:"copyright",15:"category"};function S(e,t,n){for(var r,i,o,a,s=new DataView(e),l={},u=t;u<t+n;)28===s.getUint8(u)&&2===s.getUint8(u+1)&&(a=s.getUint8(u+2))in h&&((o=s.getInt16(u+3))+5,i=h[a],r=y(s,u+5,o),l.hasOwnProperty(i)?l[i]instanceof Array?l[i].push(r):l[i]=[l[i],r]:l[i]=r),u++;return l}function P(e,t,n,r,i){var o,a,s,l=e.getUint16(n,!i),u={};for(s=0;s<l;s++)o=n+12*s+2,!(a=r[e.getUint16(o,!i)])&&d&&console.log("Unknown tag: "+e.getUint16(o,!i)),u[a]=F(e,o,t,n,i);return u}function F(e,t,n,r,i){var o,a,s,l,u,c,d=e.getUint16(t+2,!i),f=e.getUint32(t+4,!i),g=e.getUint32(t+8,!i)+n;switch(d){case 1:case 7:if(1==f)return e.getUint8(t+8,!i);for(o=4<f?g:t+8,a=[],l=0;l<f;l++)a[l]=e.getUint8(o+l);return a;case 2:return y(e,o=4<f?g:t+8,f-1);case 3:if(1==f)return e.getUint16(t+8,!i);for(o=2<f?g:t+8,a=[],l=0;l<f;l++)a[l]=e.getUint16(o+2*l,!i);return a;case 4:if(1==f)return e.getUint32(t+8,!i);for(a=[],l=0;l<f;l++)a[l]=e.getUint32(g+4*l,!i);return a;case 5:if(1==f)return u=e.getUint32(g,!i),c=e.getUint32(g+4,!i),(s=new Number(u/c)).numerator=u,s.denominator=c,s;for(a=[],l=0;l<f;l++)u=e.getUint32(g+8*l,!i),c=e.getUint32(g+4+8*l,!i),a[l]=new Number(u/c),a[l].numerator=u,a[l].denominator=c;return a;case 9:if(1==f)return e.getInt32(t+8,!i);for(a=[],l=0;l<f;l++)a[l]=e.getInt32(g+4*l,!i);return a;case 10:if(1==f)return e.getInt32(g,!i)/e.getInt32(g+4,!i);for(a=[],l=0;l<f;l++)a[l]=e.getInt32(g+8*l,!i)/e.getInt32(g+4+8*l,!i);return a}}function y(e,t,r){var i="";for(n=t;n<t+r;n++)i+=String.fromCharCode(e.getUint8(n));return i}function o(e,t){if("Exif"!=y(e,t,4))return d&&console.log("Not valid EXIF data! "+y(e,t,4)),!1;var n,r,i,o,a,s=t+6;if(18761==e.getUint16(s))n=!1;else{if(19789!=e.getUint16(s))return d&&console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)"),!1;n=!0}if(42!=e.getUint16(s+2,!n))return d&&console.log("Not valid TIFF data! (no 0x002A)"),!1;var l=e.getUint32(s+4,!n);if(l<8)return d&&console.log("Not valid TIFF data! (First offset less than 8)",e.getUint32(s+4,!n)),!1;if((r=P(e,s,s+l,c,n)).ExifIFDPointer)for(i in o=P(e,s,s+r.ExifIFDPointer,u,n)){switch(i){case"LightSource":case"Flash":case"MeteringMode":case"ExposureProgram":case"SensingMethod":case"SceneCaptureType":case"SceneType":case"CustomRendered":case"WhiteBalance":case"GainControl":case"Contrast":case"Saturation":case"Sharpness":case"SubjectDistanceRange":case"FileSource":o[i]=m[i][o[i]];break;case"ExifVersion":case"FlashpixVersion":o[i]=String.fromCharCode(o[i][0],o[i][1],o[i][2],o[i][3]);break;case"ComponentsConfiguration":o[i]=m.Components[o[i][0]]+m.Components[o[i][1]]+m.Components[o[i][2]]+m.Components[o[i][3]]}r[i]=o[i]}if(r.GPSInfoIFDPointer)for(i in a=P(e,s,s+r.GPSInfoIFDPointer,f,n)){switch(i){case"GPSVersionID":a[i]=a[i][0]+"."+a[i][1]+"."+a[i][2]+"."+a[i][3]}r[i]=a[i]}return r.thumbnail=function(e,t,n,r){var i,o,a,s,l=(o=t+n,a=r,s=(i=e).getUint16(o,!a),i.getUint32(o+2+12*s,!a));if(!l)return{};if(l>e.byteLength)return{};var u=P(e,t,t+l,g,r);if(u.Compression)switch(u.Compression){case 6:if(u.JpegIFOffset&&u.JpegIFByteCount){var c=t+u.JpegIFOffset,d=u.JpegIFByteCount;u.blob=new Blob([new Uint8Array(e.buffer,c,d)],{type:"image/jpeg"})}break;case 1:console.log("Thumbnail image format is TIFF, which is not implemented.");break;default:console.log("Unknown thumbnail image format '%s'",u.Compression)}else 2==u.PhotometricInterpretation&&console.log("Thumbnail image format is RGB, which is not implemented.");return u}(e,s,l,n),r}function b(e){var t={};if(1==e.nodeType){if(0<e.attributes.length){t["@attributes"]={};for(var n=0;n<e.attributes.length;n++){var r=e.attributes.item(n);t["@attributes"][r.nodeName]=r.nodeValue}}}else if(3==e.nodeType)return e.nodeValue;if(e.hasChildNodes())for(var i=0;i<e.childNodes.length;i++){var o=e.childNodes.item(i),a=o.nodeName;if(null==t[a])t[a]=b(o);else{if(null==t[a].push){var s=t[a];t[a]=[],t[a].push(s)}t[a].push(b(o))}}return t}function x(e){try{var t={};if(0<e.children.length)for(var n=0;n<e.children.length;n++){var r=e.children.item(n),i=r.attributes;for(var o in i){var a=i[o],s=a.nodeName,l=a.nodeValue;void 0!==s&&(t[s]=l)}var u=r.nodeName;if(void 0===t[u])t[u]=b(r);else{if(void 0===t[u].push){var c=t[u];t[u]=[],t[u].push(c)}t[u].push(b(r))}}else t=e.textContent;return t}catch(e){console.log(e.message)}}l.enableXmp=function(){l.isXmpEnabled=!0},l.disableXmp=function(){l.isXmpEnabled=!1},l.getData=function(e,t){return!((self.Image&&e instanceof self.Image||self.HTMLImageElement&&e instanceof self.HTMLImageElement)&&!e.complete)&&(i(e)?t&&t.call(e):r(e,t),!0)},l.getTag=function(e,t){if(i(e))return e.exifdata[t]},l.getIptcTag=function(e,t){if(i(e))return e.iptcdata[t]},l.getAllTags=function(e){if(!i(e))return{};var t,n=e.exifdata,r={};for(t in n)n.hasOwnProperty(t)&&(r[t]=n[t]);return r},l.getAllIptcTags=function(e){if(!i(e))return{};var t,n=e.iptcdata,r={};for(t in n)n.hasOwnProperty(t)&&(r[t]=n[t]);return r},l.pretty=function(e){if(!i(e))return"";var t,n=e.exifdata,r="";for(t in n)n.hasOwnProperty(t)&&("object"==typeof n[t]?n[t]instanceof Number?r+=t+" : "+n[t]+" ["+n[t].numerator+"/"+n[t].denominator+"]\r\n":r+=t+" : ["+n[t].length+" values]\r\n":r+=t+" : "+n[t]+"\r\n");return r},l.readFromBinaryFile=function(e){return p(e)},"function"==typeof define&&define.amd&&define("exif-js",[],function(){return l})}).call(this);
//# sourceMappingURL=/sm/4f4f84956292156efc04b79e1131dc7c3a51794b7b3d62b43ed5eaca1b36d71e.map


