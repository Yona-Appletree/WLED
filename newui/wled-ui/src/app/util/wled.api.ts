import { Dictionary } from "./dictionary.util";

export interface WledApiFullResponse {
	state: WledApiGlobalState,
	info: WledApiGlobalInfo,
	effects: WledEffectName[],
	palettes: WledPaletteName[]
}

export function isWledApiFullResponse(
	input: unknown
): input is WledApiFullResponse {
	return typeof input === "object"
		&& typeof (input as Dictionary<unknown>)["state"] === "object"
		&& typeof (input as Dictionary<unknown>)["info"] === "object"
		&& typeof (input as Dictionary<unknown>)["effects"] === "object"
		&& typeof (input as Dictionary<unknown>)["palettes"] === "object"
}

export interface WledApiGlobalInfo {
	// WLED_GLOBAL char versionString[]
	"ver": string,

	// #define VERSION: version code in format yymmddb (b = daily build)
	"vid": number,

	//
	"leds": {
		// WLED_GLOBAL uint16_t ledCount _INIT(30);          // overcurrent prevented by ABL
		"count": UInt16,

		// WLED_GLOBAL bool useRGBW      _INIT(false);       // SK6812 strips can contain an extra White channel
		"rgbw": boolean,

		// useRGBW && (strip.rgbwMode == RGBW_MODE_MANUAL_ONLY || strip.rgbwMode == RGBW_MODE_DUAL); // should a white channel slider be displayed?
		"wv": boolean,

		// #define LEDPIN 2  //strip pin. Any for ESP32, gpio2 or 3 is recommended for ESP8266 (gpio2/3 are labeled D4/RX on NodeMCU and Wemos)
		"pin": [2],

		// WS2812FX::currentMilliamps
		"pwr": UInt16,

		// (WS2812FX::currentMilliamps) ? WS2812FX::ablMilliampsMax : 0
		"maxpwr": UInt16,

		// uint8_t WS2812FX::getMaxSegments(void)
		"maxseg": UInt8,

		// false; //will be used in the future to prevent modifications to segment config
		"seglock": false
	},

	// WLED_GLOBAL bool syncToggleReceive     _INIT(false);   // UIs which only have a single button for sync should toggle send+receive if this is true, only send otherwise
	"str": boolean,

	// WLED_GLOBAL char serverDescription[33] _INIT("WLED");  // Name of module
	"name": string | "WLED",

	// WLED_GLOBAL uint16_t udpPort    _INIT(21324); // WLED notifier default port
	"udpport": 21324,

	// WLED_GLOBAL byte realtimeMode _INIT(REALTIME_MODE_INACTIVE);
	"live": WledApiRealtimeMode,

	/**
	 * switch (realtimeMode) {
	 *   case REALTIME_MODE_INACTIVE: root["lm"] = ""; break;
	 *   case REALTIME_MODE_GENERIC:  root["lm"] = ""; break;
	 *   case REALTIME_MODE_UDP:      root["lm"] = F("UDP"); break;
	 *   case REALTIME_MODE_HYPERION: root["lm"] = F("Hyperion"); break;
	 *   case REALTIME_MODE_E131:     root["lm"] = F("E1.31"); break;
	 *   case REALTIME_MODE_ADALIGHT: root["lm"] = F("USB Adalight/TPM2"); break;
	 *   case REALTIME_MODE_ARTNET:   root["lm"] = F("Art-Net"); break;
	 *   case REALTIME_MODE_TPM2NET:  root["lm"] = F("tpm2.net"); break;
	 *   case REALTIME_MODE_DDP:      root["lm"] = F("DDP"); break;
	 * }
	 */
	"lm": "" | "UDP" | "Hyperion" | "E1.31" | "USB Adalight/TPM2" | "Art-Net" | "tpm2.net" | "DDP",

	/**
	 *  (realtimeIP[0] == 0) ? "" : realtimeIP.toString()
	 */
	"lip": string,

	/**
	 * #ifdef WLED_ENABLE_WEBSOCKETS
	 * root[F("ws")] = ws.count();
	 * #else
	 * root[F("ws")] = -1;
	 * #endif
	 */
	"ws": 0,

	// uint8_t WS2812FX::getModeCount()
	"fxcount": UInt8,

	// uint8_t WS2812FX::getPaletteCount()
	"palcount": UInt8,

	"wifi": WledApiWifiInfo,
	"arch": WledArchName,

	// String EspClass::getCoreVersion()
	"core": string,

	/**
	 * // X.x.x: Major version of the stack
	 * #define LWIP_VERSION_MAJOR      1U
	 */
	"lwip": 1,

	// ESP.getFreeHeap();
	"freeheap": number,

	// root[F("uptime")] = millis()/1000 + rolloverMillis*4294967;
	"uptime": number,

	/**
	 * See WLED_BIT_WLED_*
	 */
	"opt": UInt8,

	// Brand string
	"brand": "WLED",

	// Product name
	"product": "FOSS",

	// WLED_GLOBAL String escapedMac;
	"mac": string
}

export interface WLedApiSegmentDefinition {
	col: WledOptionalRgbColor[],

	// Segment id
	id: UInt8,

	// WS2812FX::Segment::start
	start: UInt16

	// WS2812FX::Segment::stop
	stop: UInt16,

	// WS2812FX::Segment::mode
	fx: WledEffectModeIndex,

	// WS2812FX::Segment::speed
	sx: UInt8,

	// WS2812FX::Segment::intensity
	ix: UInt8,

	// WS2812FX::Segment::palette
	pal: UInt8,

	// WS2812FX::Segment::grouping
	grp: UInt8,

	// WS2812FX::Segment::spacing
	spc: UInt8,

	// WS2812FX::Segment::opacity
	bri: UInt8

	// WS2812FX::Segment::stop - WS2812FX::Segment::start
	len: UInt16,

	// WS2812FX::Segment::options & SEG_OPTION_ON
	on: boolean,

	// WS2812FX::Segment::options & SEG_OPTION_MIRROR
	mi: boolean,

	// WS2812FX::Segment::options & SEG_OPTION_REVERSED
	rev: boolean,

	// WS2812FX::Segment::options & SEG_OPTION_SELECTED
	sel: boolean,
}

/**
 * realtime override modes
 */
export enum WledApiNightlightMode {
	SET       = 0,            // NL_MODE_SET       - After nightlight time elapsed, set to target brightness
	FADE      = 1,            // NL_MODE_FADE      - Fade to target brightness gradually
	COLORFADE = 2,            // NL_MODE_COLORFADE - Fade to target brightness and secondary color gradually
	SUN       = 3,            // NL_MODE_SUN       - Sunrise/sunset. Target brightness is set immediately, then Sunrise effect is started. Max 60 min.
}

export enum WledApiRealtimeOverride {
	NONE = 0, // REALTIME_OVERRIDE_NONE
	ONCE = 1, // REALTIME_OVERRIDE_ONCE
	ALWAYS = 2, // REALTIME_OVERRIDE_ALWAYS
}

//E1.31 DMX modes
export enum WledApiDmxMode {
	DMX_MODE_DISABLED         = 0, // DMX_MODE_DISABLED     : not used
	DMX_MODE_SINGLE_RGB       = 1, // DMX_MODE_SINGLE_RGB   : all LEDs same RGB color (3 channels)
	DMX_MODE_SINGLE_DRGB      = 2, // DMX_MODE_SINGLE_DRGB  : all LEDs same RGB color and master dimmer (4 channels)
	DMX_MODE_EFFECT           = 3, // DMX_MODE_EFFECT       : trigger standalone effects of WLED (11 channels)
	DMX_MODE_MULTIPLE_RGB     = 4, // DMX_MODE_MULTIPLE_RGB : every LED is addressed with its own RGB (ledCount * 3 channels)
	DMX_MODE_MULTIPLE_DRGB    = 5, // DMX_MODE_MULTIPLE_DRGB: every LED is addressed with its own RGB and share a master dimmer (ledCount * 3 + 1 channels)
	DMX_MODE_MULTIPLE_RGBW    = 6, // DMX_MODE_MULTIPLE_RGBW: every LED is addressed with its own RGBW (ledCount * 4 channels)
}

//realtime modes
export enum WledApiRealtimeMode {
	INACTIVE    = 0, // REALTIME_MODE_INACTIVE
	GENERIC     = 1, // REALTIME_MODE_GENERIC
	UDP         = 2, // REALTIME_MODE_UDP
	HYPERION    = 3, // REALTIME_MODE_HYPERION
	E131        = 4, // REALTIME_MODE_E131
	ADALIGHT    = 5, // REALTIME_MODE_ADALIGHT
	ARTNET      = 6, // REALTIME_MODE_ARTNET
	TPM2NET     = 7, // REALTIME_MODE_TPM2NET
	DDP         = 8, // REALTIME_MODE_DDP
}

const BIT_WLED_DEBUG              = 0x80;
const BIT_WLED_DISABLE_ALEXA      = 0x40;
const BIT_WLED_DISABLE_BLYNK      = 0x20;
const BIT_WLED_DISABLE_CRONIXIE   = 0x10;
const BIT_WLED_DISABLE_FILESYSTEM = 0x08;
const BIT_WLED_DISABLE_HUESYNC    = 0x04;
const BIT_WLED_ENABLE_ADALIGHT    = 0x02;
const BIT_WLED_DISABLE_OTA        = 0x01;

// See json.cpp#serializeState
export interface WledApiGlobalState {
	// Indicates if current brightness value is greater than 0
	"on": boolean,

	// WLED_GLOBAL byte briLast -- brightness before turned off. Used for toggle function
	"bri": UInt8,

	// WLED_GLOBAL uint16_t transitionDelay / 100 -- transition delay, but divided by 100
	"transition": number,

	// WLED_GLOBAL int16_t currentPreset
	"ps": Int16,

	// WLED_GLOBAL uint16_t savedPresets -- number of currently saved presents?
	"pss": number,


	// WLED_GLOBAL bool presetCyclingEnabled -- but encoded: (presetCyclingEnabled) ? 0: -1
	"pl": Int16,

	// temporary for preset cycle
	"ccnf": {
		// WLED_GLOBAL byte presetCycleMin
		"min": UInt8,

		// WLED_GLOBAL byte presetCycleMax
		"max": UInt8,

		// WLED_GLOBAL uint16_t presetCycleTime
		"time": UInt16
	},

	// "Nightlight" settings
	"nl": {
		// WLED_GLOBAL bool nightlightActive
		"on": boolean,

		// WLED_GLOBAL byte nightlightDelayMins
		"dur": number,

		// WLED_GLOBAL byte nightlightMode -- but encoded (nightlightMode > NL_MODE_SET); //deprecated
		"fade": boolean,

		// WLED_GLOBAL byte nightlightMode // See const.h for available modes. Was nightlightFade
		"mode": WledApiNightlightMode,

		// WLED_GLOBAL byte nightlightTargetBri // brightness after nightlight is over
		"tbri": UInt8,

		// If nightlight mode is active, the remaining seconds: (nightlightDelayMs - (millis() - nightlightStartTime)) / 1000
		// otherwise -1
		"rem": number
	},

	"udpn": {
		// WLED_GLOBAL bool notifyDirect _INIT(false);                       // send notification if change via UI or HTTP API
		"send": false,

		// WLED_GLOBAL bool receiveNotifications _INIT(true);
		"recv": true,

	},

	// WLED_GLOBAL byte realtimeOverride _INIT(REALTIME_OVERRIDE_NONE);
	"lor": WledApiRealtimeOverride

	// uint8_t WS2812FX::getMainSegmentId
	"mainseg": UInt8,

	"seg": WLedApiSegmentDefinition[]
}

export type WledArchName = "esp8266" | "esp32";

export interface WledApiWifiInfo {
	"bssid": string,
	"rssi": number, // e.g. -67
	"signal": number, // e.g. 66
	"channel": number, // e.g. 11
}

export type WledEffectName =
	| "Solid"
	| "Blink"
	| "Breathe"
	| "Wipe"
	| "Wipe Random"
	| "Random Colors"
	| "Sweep"
	| "Dynamic"
	| "Colorloop"
	| "Rainbow"
	| "Scan"
	| "Scan Dual"
	| "Fade"
	| "Theater"
	| "Theater Rainbow"
	| "Running"
	| "Saw"
	| "Twinkle"
	| "Dissolve"
	| "Dissolve Rnd"
	| "Sparkle"
	| "Sparkle Dark"
	| "Sparkle+"
	| "Strobe"
	| "Strobe Rainbow"
	| "Strobe Mega"
	| "Blink Rainbow"
	| "Android"
	| "Chase"
	| "Chase Random"
	| "Chase Rainbow"
	| "Chase Flash"
	| "Chase Flash Rnd"
	| "Rainbow Runner"
	| "Colorful"
	| "Traffic Light"
	| "Sweep Random"
	| "Running 2"
	| "Red & Blue"
	| "Stream"
	| "Scanner"
	| "Lighthouse"
	| "Fireworks"
	| "Rain"
	| "Merry Christmas"
	| "Fire Flicker"
	| "Gradient"
	| "Loading"
	| "Police"
	| "Police All"
	| "Two Dots"
	| "Two Areas"
	| "Circus"
	| "Halloween"
	| "Tri Chase"
	| "Tri Wipe"
	| "Tri Fade"
	| "Lightning"
	| "ICU"
	| "Multi Comet"
	| "Scanner Dual"
	| "Stream 2"
	| "Oscillate"
	| "Pride 2015"
	| "Juggle"
	| "Palette"
	| "Fire 2012"
	| "Colorwaves"
	| "Bpm"
	| "Fill Noise"
	| "Noise 1"
	| "Noise 2"
	| "Noise 3"
	| "Noise 4"
	| "Colortwinkles"
	| "Lake"
	| "Meteor"
	| "Meteor Smooth"
	| "Railway"
	| "Ripple"
	| "Twinklefox"
	| "Twinklecat"
	| "Halloween Eyes"
	| "Solid Pattern"
	| "Solid Pattern Tri"
	| "Spots"
	| "Spots Fade"
	| "Glitter"
	| "Candle"
	| "Fireworks Starburst"
	| "Fireworks 1D"
	| "Bouncing Balls"
	| "Sinelon"
	| "Sinelon Dual"
	| "Sinelon Rainbow"
	| "Popcorn"
	| "Drip"
	| "Plasma"
	| "Percent"
	| "Ripple Rainbow"
	| "Heartbeat"
	| "Pacifica"
	| "Candle Multi"
	| "Solid Glitter"
	| "Sunrise"
	| "Phased"
	| "Twinkleup"
	| "Noise Pal"
	| "Sine"
	| "Phased Noise"
	| "Flow"
	| "Chunchun"
	| "Dancing Shadows"
	| "Washing Machine";

export type WledPaletteName =
	"Default"
	| "* Random Cycle"
	| "* Color 1"
	| "* Colors 1&2"
	| "* Color Gradient"
	| "* Colors Only"
	| "Party"
	| "Cloud"
	| "Lava"
	| "Ocean"
	| "Forest"
	| "Rainbow"
	| "Rainbow Bands"
	| "Sunset"
	| "Rivendell"
	| "Breeze"
	| "Red & Blue"
	| "Yellowout"
	| "Analogous"
	| "Splash"
	| "Pastel"
	| "Sunset 2"
	| "Beech"
	| "Vintage"
	| "Departure"
	| "Landscape"
	| "Beach"
	| "Sherbet"
	| "Hult"
	| "Hult 64"
	| "Drywet"
	| "Jul"
	| "Grintage"
	| "Rewhi"
	| "Tertiary"
	| "Fire"
	| "Icefire"
	| "Cyane"
	| "Light Pink"
	| "Autumn"
	| "Magenta"
	| "Magred"
	| "Yelmag"
	| "Yelblu"
	| "Orange & Teal"
	| "Tiamat"
	| "April Night"
	| "Orangery"
	| "C9"
	| "Sakura"
	| "Aurora"
	| "Atlantica"
	| "C9 2"
	| "C9 New";


export type UInt8 = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 | 80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 | 90 | 91 | 92 | 93 | 94 | 95 | 96 | 97 | 98 | 99 | 100 | 101 | 102 | 103 | 104 | 105 | 106 | 107 | 108 | 109 | 110 | 111 | 112 | 113 | 114 | 115 | 116 | 117 | 118 | 119 | 120 | 121 | 122 | 123 | 124 | 125 | 126 | 127 | 128 | 129 | 130 | 131 | 132 | 133 | 134 | 135 | 136 | 137 | 138 | 139 | 140 | 141 | 142 | 143 | 144 | 145 | 146 | 147 | 148 | 149 | 150 | 151 | 152 | 153 | 154 | 155 | 156 | 157 | 158 | 159 | 160 | 161 | 162 | 163 | 164 | 165 | 166 | 167 | 168 | 169 | 170 | 171 | 172 | 173 | 174 | 175 | 176 | 177 | 178 | 179 | 180 | 181 | 182 | 183 | 184 | 185 | 186 | 187 | 188 | 189 | 190 | 191 | 192 | 193 | 194 | 195 | 196 | 197 | 198 | 199 | 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 209 | 210 | 211 | 212 | 213 | 214 | 215 | 216 | 217 | 218 | 219 | 220 | 221 | 222 | 223 | 224 | 225 | 226 | 227 | 228 | 229 | 230 | 231 | 232 | 233 | 234 | 235 | 236 | 237 | 238 | 239 | 240 | 241 | 242 | 243 | 244 | 245 | 246 | 247 | 248 | 249 | 250 | 251 | 252 | 253 | 254 | 255;
export type UInt16 = number;
export type Int16 = number;
export type WLedRgbColor = [UInt8, UInt8, UInt8];
export type WLedRgbwColor = [UInt8, UInt8, UInt8, UInt8];
export type WLedRgbOrRgbwColor = [UInt8, UInt8, UInt8] | [UInt8, UInt8, UInt8, UInt8];
export type WledOptionalRgbColor = WLedRgbColor | [];

export function isWledRgbColor(input: unknown): input is WLedRgbColor {
	return Array.isArray(input)
		&& input.length === 3
		&& typeof(input[0]) === "number"
		&& typeof(input[1]) === "number"
		&& typeof(input[2]) === "number";
}

export enum WledEffectModeIndex {
	STATIC                  =   0, // FX_MODE_STATIC                : "Solid"
	BLINK                   =   1, // FX_MODE_BLINK                 : "Blink"
	BREATH                  =   2, // FX_MODE_BREATH                : "Breathe"
	COLOR_WIPE              =   3, // FX_MODE_COLOR_WIPE            : "Wipe"
	COLOR_WIPE_RANDOM       =   4, // FX_MODE_COLOR_WIPE_RANDOM     : "Wipe Random"
	RANDOM_COLOR            =   5, // FX_MODE_RANDOM_COLOR          : "Random Colors"
	COLOR_SWEEP             =   6, // FX_MODE_COLOR_SWEEP           : "Sweep"
	DYNAMIC                 =   7, // FX_MODE_DYNAMIC               : "Dynamic"
	RAINBOW                 =   8, // FX_MODE_RAINBOW               : "Colorloop"
	RAINBOW_CYCLE           =   9, // FX_MODE_RAINBOW_CYCLE         : "Rainbow"
	SCAN                    =  10, // FX_MODE_SCAN                  : "Scan"
	DUAL_SCAN               =  11, // FX_MODE_DUAL_SCAN             : "Scan Dual"
	FADE                    =  12, // FX_MODE_FADE                  : "Fade"
	THEATER_CHASE           =  13, // FX_MODE_THEATER_CHASE         : "Theater"
	THEATER_CHASE_RAINBOW   =  14, // FX_MODE_THEATER_CHASE_RAINBOW : "Theater Rainbow"
	RUNNING_LIGHTS          =  15, // FX_MODE_RUNNING_LIGHTS        : "Running"
	SAW                     =  16, // FX_MODE_SAW                   : "Saw"
	TWINKLE                 =  17, // FX_MODE_TWINKLE               : "Twinkle"
	DISSOLVE                =  18, // FX_MODE_DISSOLVE              : "Dissolve"
	DISSOLVE_RANDOM         =  19, // FX_MODE_DISSOLVE_RANDOM       : "Dissolve Rnd"
	SPARKLE                 =  20, // FX_MODE_SPARKLE               : "Sparkle"
	FLASH_SPARKLE           =  21, // FX_MODE_FLASH_SPARKLE         : "Sparkle Dark"
	HYPER_SPARKLE           =  22, // FX_MODE_HYPER_SPARKLE         : "Sparkle+"
	STROBE                  =  23, // FX_MODE_STROBE                : "Strobe"
	STROBE_RAINBOW          =  24, // FX_MODE_STROBE_RAINBOW        : "Strobe Rainbow"
	MULTI_STROBE            =  25, // FX_MODE_MULTI_STROBE          : "Strobe Mega"
	BLINK_RAINBOW           =  26, // FX_MODE_BLINK_RAINBOW         : "Blink Rainbow"
	ANDROID                 =  27, // FX_MODE_ANDROID               : "Android"
	CHASE_COLOR             =  28, // FX_MODE_CHASE_COLOR           : "Chase"
	CHASE_RANDOM            =  29, // FX_MODE_CHASE_RANDOM          : "Chase Random"
	CHASE_RAINBOW           =  30, // FX_MODE_CHASE_RAINBOW         : "Chase Rainbow"
	CHASE_FLASH             =  31, // FX_MODE_CHASE_FLASH           : "Chase Flash"
	CHASE_FLASH_RANDOM      =  32, // FX_MODE_CHASE_FLASH_RANDOM    : "Chase Flash Rnd"
	CHASE_RAINBOW_WHITE     =  33, // FX_MODE_CHASE_RAINBOW_WHITE   : "Rainbow Runner"
	COLORFUL                =  34, // FX_MODE_COLORFUL              : "Colorful"
	TRAFFIC_LIGHT           =  35, // FX_MODE_TRAFFIC_LIGHT         : "Traffic Light"
	COLOR_SWEEP_RANDOM      =  36, // FX_MODE_COLOR_SWEEP_RANDOM    : "Sweep Random"
	RUNNING_COLOR           =  37, // FX_MODE_RUNNING_COLOR         : "Running 2"
	RUNNING_RED_BLUE        =  38, // FX_MODE_RUNNING_RED_BLUE      : "Red & Blue"
	RUNNING_RANDOM          =  39, // FX_MODE_RUNNING_RANDOM        : "Stream"
	LARSON_SCANNER          =  40, // FX_MODE_LARSON_SCANNER        : "Scanner"
	COMET                   =  41, // FX_MODE_COMET                 : "Lighthouse"
	FIREWORKS               =  42, // FX_MODE_FIREWORKS             : "Fireworks"
	RAIN                    =  43, // FX_MODE_RAIN                  : "Rain"
	MERRY_CHRISTMAS         =  44, // FX_MODE_MERRY_CHRISTMAS       : "Merry Christmas"
	FIRE_FLICKER            =  45, // FX_MODE_FIRE_FLICKER          : "Fire Flicker"
	GRADIENT                =  46, // FX_MODE_GRADIENT              : "Gradient"
	LOADING                 =  47, // FX_MODE_LOADING               : "Loading"
	POLICE                  =  48, // FX_MODE_POLICE                : "Police"
	POLICE_ALL              =  49, // FX_MODE_POLICE_ALL            : "Police All"
	TWO_DOTS                =  50, // FX_MODE_TWO_DOTS              : "Two Dots"
	TWO_AREAS               =  51, // FX_MODE_TWO_AREAS             : "Two Areas"
	CIRCUS_COMBUSTUS        =  52, // FX_MODE_CIRCUS_COMBUSTUS      : "Circus"
	HALLOWEEN               =  53, // FX_MODE_HALLOWEEN             : "Halloween"
	TRICOLOR_CHASE          =  54, // FX_MODE_TRICOLOR_CHASE        : "Tri Chase"
	TRICOLOR_WIPE           =  55, // FX_MODE_TRICOLOR_WIPE         : "Tri Wipe"
	TRICOLOR_FADE           =  56, // FX_MODE_TRICOLOR_FADE         : "Tri Fade"
	LIGHTNING               =  57, // FX_MODE_LIGHTNING             : "Lightning"
	ICU                     =  58, // FX_MODE_ICU                   : "ICU"
	MULTI_COMET             =  59, // FX_MODE_MULTI_COMET           : "Multi Comet"
	DUAL_LARSON_SCANNER     =  60, // FX_MODE_DUAL_LARSON_SCANNER   : "Scanner Dual"
	RANDOM_CHASE            =  61, // FX_MODE_RANDOM_CHASE          : "Stream 2"
	OSCILLATE               =  62, // FX_MODE_OSCILLATE             : "Oscillate"
	PRIDE_2015              =  63, // FX_MODE_PRIDE_2015            : "Pride 2015"
	JUGGLE                  =  64, // FX_MODE_JUGGLE                : "Juggle"
	PALETTE                 =  65, // FX_MODE_PALETTE               : "Palette"
	FIRE_2012               =  66, // FX_MODE_FIRE_2012             : "Fire 2012"
	COLORWAVES              =  67, // FX_MODE_COLORWAVES            : "Colorwaves"
	BPM                     =  68, // FX_MODE_BPM                   : "Bpm"
	FILLNOISE8              =  69, // FX_MODE_FILLNOISE8            : "Fill Noise"
	NOISE16_1               =  70, // FX_MODE_NOISE16_1             : "Noise 1"
	NOISE16_2               =  71, // FX_MODE_NOISE16_2             : "Noise 2"
	NOISE16_3               =  72, // FX_MODE_NOISE16_3             : "Noise 3"
	NOISE16_4               =  73, // FX_MODE_NOISE16_4             : "Noise 4"
	COLORTWINKLE            =  74, // FX_MODE_COLORTWINKLE          : "Colortwinkles"
	LAKE                    =  75, // FX_MODE_LAKE                  : "Lake"
	METEOR                  =  76, // FX_MODE_METEOR                : "Meteor"
	METEOR_SMOOTH           =  77, // FX_MODE_METEOR_SMOOTH         : "Meteor Smooth"
	RAILWAY                 =  78, // FX_MODE_RAILWAY               : "Railway"
	RIPPLE                  =  79, // FX_MODE_RIPPLE                : "Ripple"
	TWINKLEFOX              =  80, // FX_MODE_TWINKLEFOX            : "Twinklefox"
	TWINKLECAT              =  81, // FX_MODE_TWINKLECAT            : "Twinklecat"
	HALLOWEEN_EYES          =  82, // FX_MODE_HALLOWEEN_EYES        : "Halloween Eyes"
	STATIC_PATTERN          =  83, // FX_MODE_STATIC_PATTERN        : "Solid Pattern"
	TRI_STATIC_PATTERN      =  84, // FX_MODE_TRI_STATIC_PATTERN    : "Solid Pattern Tri"
	SPOTS                   =  85, // FX_MODE_SPOTS                 : "Spots"
	SPOTS_FADE              =  86, // FX_MODE_SPOTS_FADE            : "Spots Fade"
	GLITTER                 =  87, // FX_MODE_GLITTER               : "Glitter"
	CANDLE                  =  88, // FX_MODE_CANDLE                : "Candle"
	STARBURST               =  89, // FX_MODE_STARBURST             : "Fireworks Starburst"
	EXPLODING_FIREWORKS     =  90, // FX_MODE_EXPLODING_FIREWORKS   : "Fireworks 1D"
	BOUNCINGBALLS           =  91, // FX_MODE_BOUNCINGBALLS         : "Bouncing Balls"
	SINELON                 =  92, // FX_MODE_SINELON               : "Sinelon"
	SINELON_DUAL            =  93, // FX_MODE_SINELON_DUAL          : "Sinelon Dual"
	SINELON_RAINBOW         =  94, // FX_MODE_SINELON_RAINBOW       : "Sinelon Rainbow"
	POPCORN                 =  95, // FX_MODE_POPCORN               : "Popcorn"
	DRIP                    =  96, // FX_MODE_DRIP                  : "Drip"
	PLASMA                  =  97, // FX_MODE_PLASMA                : "Plasma"
	PERCENT                 =  98, // FX_MODE_PERCENT               : "Percent"
	RIPPLE_RAINBOW          =  99, // FX_MODE_RIPPLE_RAINBOW        : "Ripple Rainbow"
	HEARTBEAT               = 100, // FX_MODE_HEARTBEAT             : "Heartbeat"
	PACIFICA                = 101, // FX_MODE_PACIFICA              : "Pacifica"
	CANDLE_MULTI            = 102, // FX_MODE_CANDLE_MULTI          : "Candle Multi"
	SOLID_GLITTER           = 103, // FX_MODE_SOLID_GLITTER         : "Solid Glitter"
	SUNRISE                 = 104, // FX_MODE_SUNRISE               : "Sunrise"
	PHASED                  = 105, // FX_MODE_PHASED                : "Phased"
	TWINKLEUP               = 106, // FX_MODE_TWINKLEUP             : "Twinkleup"
	NOISEPAL                = 107, // FX_MODE_NOISEPAL              : "Noise Pal"
	SINEWAVE                = 108, // FX_MODE_SINEWAVE              : "Sine"
	PHASEDNOISE             = 109, // FX_MODE_PHASEDNOISE           : "Phased Noise"
	FLOW                    = 110, // FX_MODE_FLOW                  : "Flow"
	CHUNCHUN                = 111, // FX_MODE_CHUNCHUN              : "Chunchun"
	DANCING_SHADOWS         = 112, // FX_MODE_DANCING_SHADOWS       : "Dancing Shadows"
	WASHING_MACHINE         = 113, // FX_MODE_WASHING_MACHINE       : "Washing Machine"
	CANDY_CANE              = 114, // FX_MODE_CANDY_CANE            : "Candy Cane"
	BLENDS                  = 115, // FX_MODE_BLENDS                : "Blends"
}



















































































































