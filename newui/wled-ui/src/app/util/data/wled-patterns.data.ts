/**
 * Information about a WLED effect, especially how it uses the various color slots.
 */
import { buildInfoMap } from "../info-map.util";
import { WledEffectModeIndex } from "../wled.api";

interface UiEffectModeInfo {
	/**
	 * WLED Mode Index
	 */
	wledIndex: WledEffectModeIndex;

	/**
	 * A string representing this mode for UI use
	 */
	effectId: UiEffectModeId;

	/**
	 * The name of the WS2812FX method that implements this effect mode. Found in FX.cpp.
	 */
	wledFxMethod: string;

	/**
	 * The name of this mode as shown in the WLED UI, from `JSON_mode_names` in FX.h
	 */
	wledUiName: string;

	/**
	 * Name proposed by Hypher for this mode during his audit of all modes.
	 */
	proposedName: string;

	/**
	 * Description written by Hypher for this mode during his audit of all modes.
	 */
	description?: string;

	/**
	 * Indicates if the "speed" option is used by this mode, and optionally, the label to use.
	 */
	speedInfo?: UOptionInfo;

	/**
	 * Indicates if the "intensity" option is used by this mode, and optionally, the label to use.
	 */
	intensityInfo?: UOptionInfo;

	/**
	 * Indicates if the primaryColor option is used by this mode, and optionally, the label to use.
	 */
	primaryColorInfo?: UOptionInfo;

	/**
	 * Indicates if the secondaryColor option is used by this mode, and optionally, the label to use.
	 */
	secondaryColorInfo?: UOptionInfo;

	/**
	 * Indicates if the tertiaryColor option is used by this mode, and optionally, the label to use.
	 */
	tertiaryColorInfo?: UOptionInfo;

	/**
	 * Indicates if the palette option is used by this mode, and optionally, the label to use.
	 */
	paletteInfo?: UOptionInfo;

	/**
	 * Indicates which color is used when the palette is set to "default" (0). Some patterns
	 * support using either a solid color or a gradient for one of their colors. They are not
	 * consistent as to which slot is used this way.
	 */
	defaultPaletteUsesColor?: "primary" | "secondary" | "tertiary";

	/**
	 * Notes by Hypher while auditing this mode
	 */
	devNotes?: string;

	/**
	 * Indicates Hypher thought this was a particularly interesting pattern that should be
	 * showcased.
	 */
	showcase?: boolean;
}

/**
 * Information about how one of the color slots is used by an effect.
 */
type UOptionInfo = string | boolean;

export const effectModeInfoMap = buildInfoMap<
	"effectId",
	UiEffectModeId,
	UiEffectModeInfo
>(
	"effectId",
	{
		FX_MODE_STATIC: {
			wledIndex: WledEffectModeIndex.STATIC,
			wledUiName: "Solid",
			proposedName: "Single Color",
			wledFxMethod: "mode_static",
			description: "All LEDs one color",

			speedInfo: false,
			intensityInfo: false,
			primaryColorInfo: "Color",
			secondaryColorInfo: false,
			tertiaryColorInfo: false,
			paletteInfo: false,
		},

		FX_MODE_BLINK: {
			wledIndex: WledEffectModeIndex.BLINK,
			wledUiName: "Blink",
			proposedName: "Blink",
			wledFxMethod: "mode_blink",
			description: "Alternate between two solid colors",

			speedInfo: true,
			intensityInfo: true,
			primaryColorInfo: "Color 1",
			secondaryColorInfo: "Color 2",
			tertiaryColorInfo: false,
			paletteInfo: false,
		},

		FX_MODE_BLINK_RAINBOW: {
			wledIndex: WledEffectModeIndex.BLINK_RAINBOW,
			wledUiName: "Blink Rainbow",
			proposedName: "Palette Blink",
			wledFxMethod: "mode_blink_rainbow",
			description: "All LEDs alternate between a fading gradient and a solid color",

			speedInfo: true,
			intensityInfo: "Gradient / Solid Ratio",
			primaryColorInfo: false,
			secondaryColorInfo: "Solid Color",
			tertiaryColorInfo: false,
			paletteInfo: "Gradient",
		},

		FX_MODE_STROBE: {
			wledIndex: WledEffectModeIndex.STROBE,
			wledUiName: "Strobe",
			proposedName: "Strobe",
			wledFxMethod: "mode_strobe",
			description: "All LEDs display base color with strobes of another color",

			speedInfo: true,
			intensityInfo: false,
			primaryColorInfo: "Strobe Color",
			secondaryColorInfo: "Base Color",
		},

		FX_MODE_STROBE_RAINBOW:          {
			wledIndex: WledEffectModeIndex.STROBE_RAINBOW,
			wledUiName: "Strobe Rainbow",
			proposedName: "Strobe Gradient",
			wledFxMethod: "mode_strobe_rainbow",
			description: "All LEDs display base color with strokes of a changing gradient",

			speedInfo: true,
			intensityInfo: false,
			secondaryColorInfo: "Base Color",
			paletteInfo: true,
		},

		FX_MODE_COLOR_WIPE:              {
			wledIndex: WledEffectModeIndex.COLOR_WIPE, 
			wledUiName: "Wipe",
			proposedName: "Color Wipe",
			wledFxMethod: "mode_color_wipe",
			description: "LEDs turn on left to right, revealing gradient, then turn off left to right",

			speedInfo: true,
			intensityInfo: false,
			secondaryColorInfo: "Background Color",
			paletteInfo: "Foreground Gradient"
		},

		FX_MODE_COLOR_SWEEP:             {
			wledIndex: WledEffectModeIndex.COLOR_SWEEP,
			wledUiName: "Sweep",
			proposedName: "Color Sweep",
			wledFxMethod: "mode_color_sweep",
			description: "LEDs turn on left to right, revealing gradient, then turn off right to left.",

			speedInfo: true,
			intensityInfo: false,
			secondaryColorInfo: "Background Color",
			paletteInfo: "Foreground Gradient"
		},

		FX_MODE_COLOR_WIPE_RANDOM:       {
			wledIndex: WledEffectModeIndex.COLOR_WIPE_RANDOM,
			wledUiName: "Wipe Random",
			proposedName: "Color Wipe Random",
			wledFxMethod: "mode_color_wipe_random",
			description: "LEDs turn on left to right, then turn off left to right. Foreground and background colors are picked at random from palette.",
			speedInfo: true,
			paletteInfo: "Palette"
		},

		FX_MODE_COLOR_SWEEP_RANDOM:      {
			wledIndex: WledEffectModeIndex.COLOR_SWEEP_RANDOM,
			wledFxMethod: "mode_color_sweep_random",
			wledUiName: "Sweep Random",
			proposedName: "Color Sweep Random",
			description: "LEDs turn on left to right, then turn off right to left. Foreground and background colors are picked at random from palette.",
			speedInfo: true,
		},

		FX_MODE_RANDOM_COLOR:            {
			wledIndex: WledEffectModeIndex.RANDOM_COLOR, 
			wledFxMethod: "mode_random_color",
			wledUiName: "Random Colors",
			proposedName: "Random Color: All",
			description: "All LEDs fade between colors picked at random from the palette",
			paletteInfo: "Palette",
			speedInfo: true,
			intensityInfo: true,
		},

		FX_MODE_DYNAMIC:                 {
			wledIndex: WledEffectModeIndex.DYNAMIC, 
			wledFxMethod: "mode_dynamic",
			wledUiName: "Dynamic",
			proposedName: "Random Color: Separate",
			description: "Each LED assigned a random color from the palette, all changed at same time",
			paletteInfo: "Palette",
			speedInfo: true,
			intensityInfo: true,
		},

		FX_MODE_BREATH:                  {
			wledIndex: WledEffectModeIndex.BREATH,
			wledFxMethod: "mode_breath",
			wledUiName: "Breathe",
			proposedName: "Fade: Breathe",
			description: "LEDs fade between a background color and a gradient, reminiscent of Apple Device standby fade",

			speedInfo: true,
			intensityInfo: false,
			paletteInfo: "Gradient",
			secondaryColorInfo: "Background Color"
		},

		FX_MODE_FADE:                    {
			wledIndex: WledEffectModeIndex.FADE,
			wledFxMethod: "mode_fade",
			wledUiName: "Fade",
			proposedName: "Fade: Fade",
			description: "LEDs fade between a background color and a gradient",

			speedInfo: true,
			intensityInfo: false,
			paletteInfo: "Gradient",
			secondaryColorInfo: "Background Color"
		},


		FX_MODE_SCAN:                    {
			wledIndex: WledEffectModeIndex.SCAN,
			wledFxMethod: "mode_scan",
			wledUiName: "Scan",
			proposedName: "Scan: Single",
			description: "A stripe of gradient is moved back and forth against a background",

			speedInfo: true,
			intensityInfo: "Stripe Width",
			paletteInfo: "Stripe Palette",
			secondaryColorInfo: "Background Color"
		},

		FX_MODE_DUAL_SCAN:               {
			wledIndex: WledEffectModeIndex.DUAL_SCAN,
			wledFxMethod: "mode_dual_scan",
			wledUiName: "Scan Dual",
			proposedName: "Scan: Dual",
			description: "Two stripes of gradient move back and forth against a background",

			speedInfo: true,
			intensityInfo: "Stripe Width",
			paletteInfo: "Stripe Palette",
			secondaryColorInfo: "Background Color"
		},

		FX_MODE_RAINBOW:                 {
			wledIndex: WledEffectModeIndex.RAINBOW, 
			wledFxMethod: "mode_rainbow",
			wledUiName: "Colorloop",
			proposedName: "Gradient: All Fade",
			description: "All LEDs fade through a gradient",

			speedInfo: true,
			intensityInfo: "Saturation",
			paletteInfo: "Gradient"
		},

		FX_MODE_RAINBOW_CYCLE:           {
			wledIndex: WledEffectModeIndex.RAINBOW_CYCLE, 
			wledFxMethod: "mode_rainbow_cycle",
			wledUiName: "Rainbow",
			proposedName: "Gradient: Moving",
			description: "Gradient moves across the LEDs",

			speedInfo: true,
			intensityInfo: "Gradient Zoom (Inverse)",
			paletteInfo: "Gradient"
		},

		FX_MODE_THEATER_CHASE:           {
			wledIndex: WledEffectModeIndex.THEATER_CHASE, 
			wledFxMethod: "mode_theater_chase",
			wledUiName: "Theater",
			proposedName: "Theater: Individual",
			description: "Gradient showing through a background with many small alternating stripes",

			speedInfo: true,
			intensityInfo: "Gradient Dot Density",

			paletteInfo: "Gradient",
			secondaryColorInfo: "Background Color",
		},

		FX_MODE_THEATER_CHASE_RAINBOW:   {
			wledIndex: WledEffectModeIndex.THEATER_CHASE_RAINBOW, 
			wledFxMethod: "mode_theater_chase_rainbow",
			wledUiName: "Theater Rainbow",

			proposedName: "Theater: All",
			description: "Many small alternating strips, all the same color, fading through a gradient, over a background color",

			speedInfo: true,
			intensityInfo: "Gradient Dot Density",

			paletteInfo: "Gradient",
			secondaryColorInfo: "Background Color",
		},

		FX_MODE_RUNNING_LIGHTS:          {
			wledIndex: WledEffectModeIndex.RUNNING_LIGHTS,
			wledFxMethod: "mode_running_lights",
			wledUiName: "Running",
			proposedName: "Gradient: Smooth Stripes",
			description: "Smooth Stripes of a gradient moving over a background",


			speedInfo: true,
			intensityInfo: "Gradient Stripe Width (Inverse)",

			paletteInfo: "Gradient",
			secondaryColorInfo: "Background Color",
		},

		FX_MODE_SAW:                     {
			wledIndex: WledEffectModeIndex.SAW,
			wledFxMethod: "mode_saw",
			wledUiName: "Saw",
			proposedName: "Gradient: Saw Stripes",
			description: "Stripes of a gradient moving over a background, leading edge is sharp.",


			speedInfo: true,
			intensityInfo: "Gradient Stripe Width (Inverse)",

			paletteInfo: "Gradient",
			secondaryColorInfo: "Background Color",
		},

		FX_MODE_TWINKLE:                 {
			wledIndex: WledEffectModeIndex.TWINKLE,
			wledFxMethod: "mode_twinkle",
			wledUiName: "Twinkle",
			proposedName: "Twinkle",
			description: "LEDs slowly and randomly blink on and off with colors from a gradient over a background",

			paletteInfo: "Gradient",
			secondaryColorInfo: "Background Color",

			speedInfo: true,
			intensityInfo: "Blink lifetime"
		},


		FX_MODE_DISSOLVE:                {
			wledIndex: WledEffectModeIndex.DISSOLVE,
			wledFxMethod: "mode_dissolve",
			wledUiName: "Dissolve",
			proposedName: "Dissolve",
			description: "LEDs quickly randomly blink, alternating between a gradient and a background, reminiscent of a video dissolve effect",

			paletteInfo: "Gradient",
			secondaryColorInfo: "Background Color",

			speedInfo: true,
			intensityInfo: "Blink Intensity"
		},

		FX_MODE_DISSOLVE_RANDOM:         {
			wledIndex: WledEffectModeIndex.DISSOLVE_RANDOM,
			wledFxMethod: "mode_dissolve_random",
			wledUiName: "Dissolve Rnd",
			proposedName: "Dissolve: Random",
			description: "LEDs quickly randomly blink, alternating between a shuffled gradient and a background, reminiscent of a video dissolve effect",

			paletteInfo: "Gradient",
			secondaryColorInfo: "Background Color",

			speedInfo: true,
			intensityInfo: "Blink Intensity"
		},

		FX_MODE_SPARKLE:                 {
			wledIndex: WledEffectModeIndex.SPARKLE,
			wledFxMethod: "mode_sparkle",
			wledUiName: "Sparkle",
			proposedName: "Sparkle: Color 1 over Gradient",

			description: "Sparkles a color over a gradient background",
			speedInfo: true,
			intensityInfo: false,

			primaryColorInfo: "Sparkle Color",
			paletteInfo: "Background Gradient",
		},

		FX_MODE_FLASH_SPARKLE:           {
			wledIndex: WledEffectModeIndex.FLASH_SPARKLE,
			wledFxMethod: "mode_flash_sparkle",
			wledUiName: "Sparkle Dark",
			proposedName: "Sparkle: Color 2 over Gradient",

			description: "Sparkles a color over a gradient background",
			speedInfo: true,
			intensityInfo: false,

			secondaryColorInfo: "Sparkle Color",
			paletteInfo: "Background Gradient",
		},

		FX_MODE_HYPER_SPARKLE:           {
			wledIndex: WledEffectModeIndex.HYPER_SPARKLE,
			wledFxMethod: "mode_hyper_sparkle",
			wledUiName: "Sparkle+",
			proposedName: "Sparkle+: Color 2 over Gradient",

			description: "Sparkles a lot of a color over a gradient background",
			speedInfo: true,
			intensityInfo: false,

			secondaryColorInfo: "Sparkle Color",
			paletteInfo: "Background Gradient",
		},

		FX_MODE_MULTI_STROBE:            {
			wledIndex: WledEffectModeIndex.MULTI_STROBE,
			wledFxMethod: "mode_multi_strobe",
			wledUiName: "Strobe Mega",

			proposedName: "Strobe: Different",
			description: "Strobes a color over a background gradient",

			speedInfo: true,
			intensityInfo: false,

			primaryColorInfo: "Strobe Color",
			paletteInfo: "Background Gradient"
		},

		FX_MODE_ANDROID:                 {
			wledIndex: WledEffectModeIndex.ANDROID,
			wledFxMethod: "mode_android",
			wledUiName: "Android",

			proposedName: "Android Loading",
			description: "Displays a solid band that pulses while moving back and forth over a gradient background",

			speedInfo: true,
			intensityInfo: "Band Width",

			primaryColorInfo: "Band Color",
			paletteInfo: "Background Gradient"
		},

		FX_MODE_CHASE_COLOR:             {
			wledIndex: WledEffectModeIndex.CHASE_COLOR,
			wledFxMethod: "mode_chase_color",
			wledUiName: "Chase",

			proposedName: "Chase: Gradient",
			description: "Two connected solid bars of color move over a gradient background",

			speedInfo: true,
			intensityInfo: "Bar Width",

			primaryColorInfo: "Left Bar Color",
			tertiaryColorInfo: "Right Bar Color",

			paletteInfo: "Background Gradient"
		},

		FX_MODE_CHASE_RANDOM:            {
			wledIndex: WledEffectModeIndex.CHASE_RANDOM,
			wledFxMethod: "mode_chase_random",
			wledUiName: "Chase: Random",

			proposedName: "Chase: Two",
			description: "Two connected solid bars of color move over a solid background randomly picked from the gradient on each cycle",

			speedInfo: true,
			intensityInfo: "Bar Width",

			primaryColorInfo: "Left Bar Color",
			tertiaryColorInfo: "Right Bar Color",

			paletteInfo: "Background Gradient"
		},

		FX_MODE_CHASE_RAINBOW:           {
			wledIndex: WledEffectModeIndex.CHASE_RAINBOW,
			wledFxMethod: "mode_chase_rainbow",
			wledUiName: "Chase Rainbow",

			proposedName: "Chase: Two",
			description: "Two connected solid bars of color move over a solid background fading through the gradient",

			speedInfo: true,
			intensityInfo: "Bar Width",

			primaryColorInfo: "Left Bar Color",
			tertiaryColorInfo: "Right Bar Color",

			paletteInfo: "Background Gradient"
		},

		FX_MODE_CHASE_FLASH:             {
			wledIndex: WledEffectModeIndex.CHASE_FLASH,
			wledFxMethod: "mode_chase_flash",
			wledUiName: "Chase Flash",

			proposedName: "Flash: Over Gradient",
			description: "Tiny flashes of a solid color, moving from left to right, over a gradient background",

			speedInfo: true,
			secondaryColorInfo: "Flash Color",
			paletteInfo: "Background Gradient"
		},

		FX_MODE_CHASE_FLASH_RANDOM:      {
			wledIndex: WledEffectModeIndex.CHASE_FLASH_RANDOM,
			wledFxMethod: "mode_chase_flash_random",
			wledUiName: "Chase Flash Rnd",

			proposedName: "Flash: Alternate Over Gradient",
			description: "Tiny flashes of a solid color randomly chosen from two colors, moving from left to right, over solid backgrounds randomly chosen",

			speedInfo: true,
			primaryColorInfo: "Flash Color 1",
			secondaryColorInfo: "Flash Color 2",

			paletteInfo: "Gradient"
		},

		FX_MODE_CHASE_RAINBOW_WHITE:     {
			wledIndex: WledEffectModeIndex.CHASE_RAINBOW_WHITE,
			wledFxMethod: "mode_chase_rainbow_white",
			wledUiName: "Rainbow Runner",

			proposedName: "Fading Bar Chase",
			description: "A bar fading through a gradient over the primary background",

			speedInfo: true,
			intensityInfo: "Bar Width",

			primaryColorInfo: "Background Color",
			paletteInfo: "Bar Gradient"
		},

		FX_MODE_COLORFUL:                {
			// TODO: This could use some improvement
			wledIndex: WledEffectModeIndex.COLORFUL,
			wledFxMethod: "mode_colorful",
			wledUiName: "Colorful",
			proposedName: "Red - Amber - Green - Blue",
			description: "Red - Amber - Green - Blue lights running over a solid background moving through the gradient",

			speedInfo: true,
			intensityInfo: "Color Choice Mode?",

			primaryColorInfo: true,
			secondaryColorInfo: true,
			tertiaryColorInfo: true,

			paletteInfo: true
		},

		FX_MODE_TRAFFIC_LIGHT:           {
			wledIndex: WledEffectModeIndex.TRAFFIC_LIGHT,
			wledFxMethod: "mode_traffic_light",
			wledUiName: "Traffic Light",
			proposedName: "Traffic Light",

			description: "Every third LED lights up red, yellow, or blue over a graident background",
			speedInfo: true,
			intensityInfo: false,

			paletteInfo: "Background Gradient"
		},

		FX_MODE_RUNNING_COLOR:           {
			wledIndex: WledEffectModeIndex.RUNNING_COLOR,
			wledFxMethod: "mode_running_color",
			wledUiName: "Running 2",

			proposedName: "Running: Secondary over Gradient",
			description: "Bands of the secondary color over a gradient background",

			speedInfo: true,
			intensityInfo: "Band Width",

			secondaryColorInfo: "Band Color",
			paletteInfo: "Background Gradient"
		},

		FX_MODE_RUNNING_RED_BLUE:        {
			wledIndex: WledEffectModeIndex.RUNNING_RED_BLUE,
			wledFxMethod: "mode_running_red_blue",
			wledUiName: "Red & Blue",
			proposedName: "Running: Blue",

			description: "Bands of blue over a background gradient",

			speedInfo: true,
			intensityInfo: "Band Width",

			paletteInfo: "Background Gradient"
		},

		FX_MODE_RUNNING_RANDOM:          {
			wledIndex: WledEffectModeIndex.RUNNING_RANDOM,
			wledFxMethod: "mode_running_random",
			wledUiName: "Stream",

			proposedName: "Stream: Random",
			description: "Random Colors Bands moving left to right, fading to black",

			speedInfo: true,
			intensityInfo: "Band Width",
			paletteInfo: "Palette"
		},

		FX_MODE_LARSON_SCANNER:          {
			wledIndex: WledEffectModeIndex.LARSON_SCANNER,
			wledFxMethod: "mode_larson_scanner",
			wledUiName: "Scanner",

			proposedName: "Scanner",
			description: "Gradient scans back and forth, then fades, over background color",

			speedInfo: true,
			intensityInfo: "Background Intensity",
			secondaryColorInfo: "Background Color",
			paletteInfo: "Scan Gradient"
		},

		FX_MODE_COMET:                   {
			wledIndex: WledEffectModeIndex.COMET,
			wledFxMethod: "mode_comet",
			wledUiName: "Lighthouse",

			proposedName: "Scanner: Lighthouse",
			description: "Gradient scans left to right, then fades, over background color",

			speedInfo: true,
			intensityInfo: "Background Intensity",
			secondaryColorInfo: "Background Color",
			paletteInfo: "Scan Gradient"
		},

		FX_MODE_FIREWORKS:               {
			wledIndex: WledEffectModeIndex.FIREWORKS,
			wledFxMethod: "mode_fireworks",
			wledUiName: "Fireworks",

			proposedName: "Fireworks",
			description: "Random bursts of color from a palette over a black background",

			speedInfo: "Firework Lifetime",
			intensityInfo: "Firework Frequency",

			paletteInfo: "Palette"
		},

		FX_MODE_RAIN:                    {
			wledIndex: WledEffectModeIndex.RAIN,
			wledFxMethod: "mode_rain",
			wledUiName: "Rain",

			proposedName: "Rain",
			description: "Random 'drops' of rain falling from right to left, picked from a palette, over a black background",

			speedInfo: "Drop Lifetime",
			intensityInfo: "Drop Frequency",

			paletteInfo: "Palette"
		},

		FX_MODE_MERRY_CHRISTMAS:         {
			wledIndex: WledEffectModeIndex.MERRY_CHRISTMAS,
			wledFxMethod: "mode_merry_christmas",
			wledUiName: "Merry Christmas",

			proposedName: "Merry Christmas",
			description: "Green bands over a gradient (default red) background",

			speedInfo: true,
			intensityInfo: "Band Width",

			paletteInfo: "Background Gradient"
		},

		FX_MODE_FIRE_FLICKER:            {
			wledIndex: WledEffectModeIndex.FIRE_FLICKER,
			wledFxMethod: "mode_fire_flicker",
			wledUiName: "Fire Flicker",

			proposedName: "Fire Flicker",
			description: "Gradient or solid color flickering",

			speedInfo: true,
			intensityInfo: "Flicker Intensity",

			primaryColorInfo: "Solid Color",
			paletteInfo: "Gradient",

			defaultPaletteUsesColor: "primary",
		},

		FX_MODE_GRADIENT:                {
			wledIndex: WledEffectModeIndex.GRADIENT,
			wledFxMethod: "mode_gradient",
			wledUiName: "Gradient",

			proposedName: "Gradient",
			description: "Soft primary color band moves over background gradient or solid color",

			speedInfo: true,
			intensityInfo: "Band Width",

			primaryColorInfo: "Band Color",
			secondaryColorInfo: "Background Color",
			paletteInfo: "Background Gradient",

			defaultPaletteUsesColor: "secondary",
		},

		FX_MODE_LOADING:                 {
			wledIndex: WledEffectModeIndex.LOADING,
			wledFxMethod: "mode_loading",
			wledUiName: "Loading",

			proposedName: "Gradient: Loading",
			description: "Left Soft / Right hard primary color band moves over background gradient or solid color",

			speedInfo: true,
			intensityInfo: "Band Width",

			primaryColorInfo: "Band Color",
			secondaryColorInfo: "Background Color",
			paletteInfo: "Background Gradient",

			defaultPaletteUsesColor: "secondary",
		},

		FX_MODE_POLICE:                  {
			wledIndex: WledEffectModeIndex.POLICE,
			wledFxMethod: "mode_police",
			wledUiName: "Police",

			proposedName: "Bands: Police",
			description: "Bands of blue and red over a solid background",

			speedInfo: true,
			intensityInfo: "Band Width",

			secondaryColorInfo: "Background Color",
		},
		FX_MODE_POLICE_ALL:              {
			wledIndex: WledEffectModeIndex.POLICE_ALL,
			wledFxMethod: "mode_police_all",
			wledUiName: "Police: All",

			proposedName: "Full Bands: Police",
			description: "Bands of blue and red moving across the LEDs",

			speedInfo: true,
			intensityInfo: false,
		},

		FX_MODE_TWO_DOTS:                {
			wledIndex: WledEffectModeIndex.TWO_DOTS,
			wledFxMethod: "mode_two_dots",
			wledUiName: "Two Dots",

			proposedName: "Two Bands",
			description: "Two solid bands of color moving over a solid background color",

			speedInfo: true,
			intensityInfo: "Band Width",

			primaryColorInfo: "Band 1 Color",
			secondaryColorInfo: "Band 2 Color",
			tertiaryColorInfo: "Background Color",
		},

		FX_MODE_TWO_AREAS:               {
			wledIndex: WledEffectModeIndex.TWO_AREAS,
			wledFxMethod: "mode_two_areas",
			wledUiName: "Two Areas",

			proposedName: "Full Bands",
			description: "Two colors alternating moving across the LEDs",

			speedInfo: true,
			intensityInfo: false,

			primaryColorInfo: "Band 1 Color",
			secondaryColorInfo: "Band 2 Color",
		},

		FX_MODE_CIRCUS_COMBUSTUS:        {
			wledIndex: WledEffectModeIndex.CIRCUS_COMBUSTUS,
			wledFxMethod: "mode_circus_combustus",
			wledUiName: "Circus",

			proposedName: "Full Bands: Circus",
			description: "Bands of white, red, and a chosen color or gradient",

			speedInfo: true,
			intensityInfo: "Band Width",

			secondaryColorInfo: "Third Color",
			paletteInfo: "Third Gradient",

			defaultPaletteUsesColor: "secondary",
		},

		FX_MODE_HALLOWEEN:               {
			wledIndex: WledEffectModeIndex.HALLOWEEN,
			wledFxMethod: "mode_halloween",
			wledUiName: "Halloween",

			proposedName: "Full Bands: Halloween",
			description: "Full Bands of red and purple moving across the LEDs",

			speedInfo: true,
			intensityInfo: "Band Width",
		},

		FX_MODE_TRICOLOR_CHASE:          {
			wledIndex: WledEffectModeIndex.TRICOLOR_CHASE,
			wledFxMethod: "mode_tricolor_chase",
			wledUiName: "Tri Chase",

			proposedName: "Full Bands: Three Colors",
			description: "Three full bands moving across the LEDs, two solid, one can be gradient or solid",

			speedInfo: true,
			intensityInfo: "Band Width",

			primaryColorInfo: "Color 1",
			tertiaryColorInfo: "Color 2",

			secondaryColorInfo: "Color 3",
			paletteInfo: "Gradient 3",

			defaultPaletteUsesColor: "secondary"
		},

		FX_MODE_TRICOLOR_WIPE:           {
			wledIndex: WledEffectModeIndex.TRICOLOR_WIPE,
			wledFxMethod: "mode_tricolor_wipe",
			wledUiName: "Tri Wipe",

			proposedName: "Tri Wipe",
			description: "Two solid colors and a color or gradient take turns wiping across the LEDs",

			speedInfo: true,
			intensityInfo: false,

			primaryColorInfo: "Color 1",
			secondaryColorInfo: "Color 2",
			tertiaryColorInfo: "Color 3",
			
			paletteInfo: "Gradient 3",
			defaultPaletteUsesColor: "tertiary",
		},

		FX_MODE_TRICOLOR_FADE:           {
			wledIndex: WledEffectModeIndex.TRICOLOR_FADE,
			wledFxMethod: "mode_tricolor_fade",
			wledUiName: "Tri Fade",

			proposedName: "Tri Wipe",
			description: "Two solid colors and a color or gradient take turns fading across all the LEDs at once",

			speedInfo: true,
			intensityInfo: false,

			primaryColorInfo: "Color 1",
			secondaryColorInfo: "Color 2",
			tertiaryColorInfo: "Color 3",

			paletteInfo: "Gradient 3",
			defaultPaletteUsesColor: "tertiary",
		},

		FX_MODE_LIGHTNING:               {
			wledIndex: WledEffectModeIndex.LIGHTNING,
			wledFxMethod: "mode_lightning",
			wledUiName: "Lightning",

			proposedName: "Lightning",
			description: "Flashes of a solid color or gradient over a solid background",

			speedInfo: true,
			intensityInfo: "Flash Frequency",

			secondaryColorInfo: "Background Color",
			paletteInfo: "Flash Gradient",
		},

		FX_MODE_ICU:                     {
			wledIndex: WledEffectModeIndex.ICU,
			wledFxMethod: "mode_icu",
			wledUiName: "ICU",

			proposedName: "ICU",
			description: "Two single pixel bands of a solid color or gradient move together but randomly across a solid background",

			speedInfo: true,
			intensityInfo: "Band Spacing",

			primaryColorInfo: "Band Color",
			paletteInfo: "Band Palette",

			defaultPaletteUsesColor: "primary",
		},

		FX_MODE_MULTI_COMET:             {
			wledIndex: WledEffectModeIndex.MULTI_COMET,
			wledFxMethod: "mode_multi_comet",
			wledUiName: "Multi Comet",

			proposedName: "Multi Comet",
			description: "Left smooth/right sharp bands overlapping bands move from left to right. One band is solid color, other is solid or gradient, background is solid color but brightness changes with intensity.",

			speedInfo: true,
			intensityInfo: "Background Brightness",

			primaryColorInfo: "Band 1 Color",
			defaultPaletteUsesColor: "primary",
			paletteInfo: "Band 1 Gradient",

			secondaryColorInfo: "Background Color",
			tertiaryColorInfo: "Band 2 Color",
		},

		FX_MODE_DUAL_LARSON_SCANNER:     {
			wledIndex: WledEffectModeIndex.DUAL_LARSON_SCANNER,
			wledFxMethod: "mode_dual_larson_scanner",
			wledUiName: "Scanner Dual",

			proposedName: "Scanner Dual",
			description: "Bouncing bands with one sharp, one smooth edge moving back and forth in opposite directions. One band is solid or gradient, one is solid, background is solid but brightness changes with intensity.",

			speedInfo: true,
			intensityInfo: "Background Brightness",

			primaryColorInfo: "Band 1 Color",
			defaultPaletteUsesColor: "primary",
			paletteInfo: "Band 1 Gradient",

			secondaryColorInfo: "Background Color",
			tertiaryColorInfo: "Band 2 Color",
		},

		FX_MODE_RANDOM_CHASE:            {
			wledIndex: WledEffectModeIndex.RANDOM_CHASE,
			wledFxMethod: "mode_random_chase",
			wledUiName: "Stream 2",

			proposedName: "Stream: Random Colors",
			description: "A stream of random pixels moving from left to right",

			speedInfo: true,
			intensityInfo: false,
		},

		FX_MODE_OSCILLATE:               {
			wledIndex: WledEffectModeIndex.OSCILLATE,
			wledFxMethod: "mode_oscillate",
			wledUiName: "Oscillate",

			proposedName: "Three Bands",
			description: "Three bands of color slowly move back and forth, mixing where they overlap",

			speedInfo: true,
			intensityInfo: "Bar width (inverse)",

			primaryColorInfo: "Color 1",
			secondaryColorInfo: "Color 2",
			tertiaryColorInfo: "Color 3",
		},

		FX_MODE_FIRE_2012:               {
			wledIndex: WledEffectModeIndex.FIRE_2012,
			wledFxMethod: "mode_fire_2012",
			wledUiName: "Fire 2012",

			proposedName: "Fire 2012",
			description: "Classic Fire Effect, uses a gradient",

			speedInfo: true,
			intensityInfo: true,

			paletteInfo: "Fire Gradient"
		},

		FX_MODE_PRIDE_2015:              {
			wledIndex: WledEffectModeIndex.PRIDE_2015,
			wledFxMethod: "mode_pride_2015",
			wledUiName: "Pride 2015",

			proposedName: "Pride Rainbows",
			description: "Bands of color cycling through the rainbow",

			speedInfo: true,
			intensityInfo: false
		},

		FX_MODE_BPM:                     {
			wledIndex: WledEffectModeIndex.BPM,
			wledFxMethod: "mode_bpm",
			wledUiName: "Bpm",

			proposedName: "Gradient Waves",
			description: "Moving gradient displayed as 'waves' with a soft left edge and sharp right edge",

			speedInfo: true,
			intensityInfo: false,

			paletteInfo: "Gradient",

			devNotes: "There are odd gaps in this pattern that probably aren't desired"
		},

		FX_MODE_JUGGLE:                  {
			wledIndex: WledEffectModeIndex.JUGGLE,
			wledFxMethod: "mode_juggle",
			wledUiName: "Juggle",

			proposedName: "Comets: 8",
			description: "8 'comets' that move back and forth in colors from the gradient, over a background color.",

			speedInfo: true,
			intensityInfo: "Fade Intensity",

			paletteInfo: "Gradient",
			secondaryColorInfo: "Background Color",

			devNotes: "Default Palette is CHSV(X, 220, 255)"
		},

		FX_MODE_PALETTE:                 {
			wledIndex: WledEffectModeIndex.PALETTE,
			wledFxMethod: "mode_palette",
			wledUiName: "Palette",

			proposedName: "Gradient",
			description: "Displays a gradient moving across the LEDs",

			speedInfo: true,
			intensityInfo: false,

			paletteInfo: "Gradient"
		},

		FX_MODE_COLORWAVES:              {
			wledIndex: WledEffectModeIndex.COLORWAVES,
			wledFxMethod: "mode_colorwaves",
			wledUiName: "Colorwaves",

			proposedName: "Small Bands",
			description: "Many small bands of constantly changing colors chosen from a gradient",

			speedInfo: true,
			intensityInfo: "Color Shift Speed",

			paletteInfo: "Gradient"
		},

		FX_MODE_FILLNOISE8:              {
			wledIndex: WledEffectModeIndex.FILLNOISE8,
			wledFxMethod: "mode_fillnoise8",
			wledUiName: "Fill Noise",

			proposedName: "Noise: Small",
			description: "Gently shifting random noise from a gradient in smallish bands",

			speedInfo: true,
			intensityInfo: false,

			paletteInfo: "Gradient"
		},

		FX_MODE_NOISE16_1:               {
			wledIndex: WledEffectModeIndex.NOISE16_1,
			wledFxMethod: "mode_noise16_1",
			wledUiName: "Noise 1",

			proposedName: "Noise: Blobs",
			description: "Gently shifting random noise from a gradient in large shifting blobs",

			speedInfo: true,
			intensityInfo: false,

			paletteInfo: "Gradient"
		},

		FX_MODE_NOISE16_2:               {
			wledIndex: WledEffectModeIndex.NOISE16_2,
			wledFxMethod: "mode_noise16_2",
			wledUiName: "Noise 2",

			proposedName: "Noise: Scrolling",
			description: "Random bands of a gradient scrolling from right to left",

			speedInfo: true,
			intensityInfo: false,

			paletteInfo: "Gradient"
		},

		FX_MODE_NOISE16_3:               {
			wledIndex: WledEffectModeIndex.NOISE16_3,
			wledFxMethod: "mode_noise16_3",
			wledUiName: "Noise 3",

			proposedName: "Noise: Blobs 2",
			description: "Gently shifting random noise from a gradient in shifting blobs",

			speedInfo: true,
			intensityInfo: false,

			paletteInfo: "Gradient",

			showcase: true
		},

		FX_MODE_NOISE16_4:               {
			wledIndex: WledEffectModeIndex.NOISE16_4,
			wledFxMethod: "mode_noise16_4",
			wledUiName: "Noise 4",

			proposedName: "Noise: Static",
			description: "Quickly shifting random noise from a gradient in a static pattern",

			speedInfo: true,
			intensityInfo: false,

			paletteInfo: "Gradient"
		},

		FX_MODE_COLORTWINKLE:            {
			wledIndex: WledEffectModeIndex.COLORTWINKLE,
			wledFxMethod: "mode_colortwinkle",
			wledUiName: "Colortwinkles",

			proposedName: "Gradient Twinkles",
			description: "Twinkles of color chosen randomly from a gradient. Reminiscent of twinkling holiday lights.",

			speedInfo: true,
			intensityInfo: "Twinkle Count",

			paletteInfo: "Gradient",

			showcase: true
		},

		FX_MODE_LAKE:                    {
			wledIndex: WledEffectModeIndex.LAKE,
			wledFxMethod: "mode_lake",
			wledUiName: "Lake",

			proposedName: "Lake",
			description: "",
		},

		FX_MODE_METEOR:                  {
			wledIndex: WledEffectModeIndex.METEOR,
			wledFxMethod: "mode_meteor",
			wledUiName: "Meteor",

			proposedName: "Meteor",
			description: "",
		},
		FX_MODE_METEOR_SMOOTH:           {
			wledIndex: WledEffectModeIndex.METEOR_SMOOTH,
			wledFxMethod: "mode_meteor_smooth",
			wledUiName: "Meteor Smooth",

			proposedName: "Meteor Smooth",
			description: "",
		},
		FX_MODE_RAILWAY:                 {
			wledIndex: WledEffectModeIndex.RAILWAY,
			wledFxMethod: "mode_railway",
			wledUiName: "Railway",

			proposedName: "Railway",
			description: "",
		},
		FX_MODE_RIPPLE:                  {
			wledIndex: WledEffectModeIndex.RIPPLE,
			wledFxMethod: "mode_ripple",
			wledUiName: "Ripple",

			proposedName: "Ripple",
			description: "",
		},
		FX_MODE_TWINKLEFOX:              {
			wledIndex: WledEffectModeIndex.TWINKLEFOX,
			wledFxMethod: "mode_twinklefox",
			wledUiName: "Twinklefox",

			proposedName: "Twinklefox",
			description: "",
		},
		FX_MODE_TWINKLECAT:              {
			wledIndex: WledEffectModeIndex.TWINKLECAT,
			wledFxMethod: "mode_twinklecat",
			wledUiName: "Twinklecat",

			proposedName: "Twinklecat",
			description: "",
		},
		FX_MODE_HALLOWEEN_EYES:          {
			wledIndex: WledEffectModeIndex.HALLOWEEN_EYES,
			wledFxMethod: "mode_halloween_eyes",
			wledUiName: "Halloween Eyes",

			proposedName: "Halloween Eyes",
			description: "",
		},
		FX_MODE_STATIC_PATTERN:          {
			wledIndex: WledEffectModeIndex.STATIC_PATTERN,
			wledFxMethod: "mode_static_pattern",
			wledUiName: "Solid Pattern",

			proposedName: "Solid Pattern",
			description: "",
		},
		FX_MODE_TRI_STATIC_PATTERN:      {
			wledIndex: WledEffectModeIndex.TRI_STATIC_PATTERN,
			wledFxMethod: "mode_tri_static_pattern",
			wledUiName: "Solid Pattern Tri",

			proposedName: "Solid Pattern Tri",
			description: "",
		},
		FX_MODE_SPOTS:                   {
			wledIndex: WledEffectModeIndex.SPOTS,
			wledFxMethod: "mode_spots",
			wledUiName: "Spots",

			proposedName: "Spots",
			description: "",
		},
		FX_MODE_SPOTS_FADE:              {
			wledIndex: WledEffectModeIndex.SPOTS_FADE,
			wledFxMethod: "mode_spots_fade",
			wledUiName: "Spots Fade",

			proposedName: "Spots Fade",
			description: "",
		},
		FX_MODE_GLITTER:                 {
			wledIndex: WledEffectModeIndex.GLITTER,
			wledFxMethod: "mode_glitter",
			wledUiName: "Glitter",

			proposedName: "Glitter",
			description: "",
		},
		FX_MODE_CANDLE:                  {
			wledIndex: WledEffectModeIndex.CANDLE,
			wledFxMethod: "mode_candle",
			wledUiName: "Candle",

			proposedName: "Candle",
			description: "",
		},
		FX_MODE_STARBURST:               {
			wledIndex: WledEffectModeIndex.STARBURST,
			wledFxMethod: "mode_starburst",
			wledUiName: "Fireworks Starburst",

			proposedName: "Fireworks Starburst",
			description: "",
		},
		FX_MODE_EXPLODING_FIREWORKS:     {
			wledIndex: WledEffectModeIndex.EXPLODING_FIREWORKS,
			wledFxMethod: "mode_exploding_fireworks",
			wledUiName: "Fireworks 1D",

			proposedName: "Fireworks 1D",
			description: "",

			showcase: true
		},
		FX_MODE_BOUNCINGBALLS:           {
			wledIndex: WledEffectModeIndex.BOUNCINGBALLS,
			wledFxMethod: "mode_bouncing_balls",
			wledUiName: "Bouncing Balls",

			proposedName: "Bouncing Balls",
			description: "",
		},
		FX_MODE_SINELON:                 {
			wledIndex: WledEffectModeIndex.SINELON,
			wledFxMethod: "mode_sinelon",
			wledUiName: "Sinelon",

			proposedName: "Sinelon",
			description: "",
		},
		FX_MODE_SINELON_DUAL:            {
			wledIndex: WledEffectModeIndex.SINELON_DUAL,
			wledFxMethod: "mode_sinelon_dual",
			wledUiName: "Sinelon Dual",

			proposedName: "Sinelon Dual",
			description: "",
		},
		FX_MODE_SINELON_RAINBOW:         {
			wledIndex: WledEffectModeIndex.SINELON_RAINBOW,
			wledFxMethod: "mode_sinelon_rainbow",
			wledUiName: "Sinelon Rainbow",

			proposedName: "Sinelon Rainbow",
			description: "",
		},
		FX_MODE_POPCORN:                 {
			wledIndex: WledEffectModeIndex.POPCORN,
			wledFxMethod: "mode_popcorn",
			wledUiName: "Popcorn",

			proposedName: "Popcorn",
			description: "",
		},
		FX_MODE_DRIP:                    {
			wledIndex: WledEffectModeIndex.DRIP,
			wledFxMethod: "mode_drip",
			wledUiName: "Drip",

			proposedName: "Drip",
			description: "",
		},
		FX_MODE_PLASMA:                  {
			wledIndex: WledEffectModeIndex.PLASMA,
			wledFxMethod: "mode_plasma",
			wledUiName: "Plasma",

			proposedName: "Plasma",
			description: "",
		},
		FX_MODE_PERCENT:                 {
			wledIndex: WledEffectModeIndex.PERCENT,
			wledFxMethod: "mode_percent",
			wledUiName: "Percent",

			proposedName: "Percent",
			description: "",
		},
		FX_MODE_RIPPLE_RAINBOW:          {
			wledIndex: WledEffectModeIndex.RIPPLE_RAINBOW,
			wledFxMethod: "mode_ripple_rainbow",
			wledUiName: "Ripple Rainbow",

			proposedName: "Ripple Rainbow",
			description: "",
		},
		FX_MODE_HEARTBEAT:               {
			wledIndex: WledEffectModeIndex.HEARTBEAT,
			wledFxMethod: "mode_heartbeat",
			wledUiName: "Heartbeat",

			proposedName: "Heartbeat",
			description: "",
		},
		FX_MODE_PACIFICA:                {
			wledIndex: WledEffectModeIndex.PACIFICA,
			wledFxMethod: "mode_pacifica",
			wledUiName: "Pacifica",

			proposedName: "Pacifica",
			description: "",
		},
		FX_MODE_CANDLE_MULTI:            {
			wledIndex: WledEffectModeIndex.CANDLE_MULTI,
			wledFxMethod: "mode_candle_multi",
			wledUiName: "Candle Multi",

			proposedName: "Candle Multi",
			description: "",
		},
		FX_MODE_SOLID_GLITTER:           {
			wledIndex: WledEffectModeIndex.SOLID_GLITTER,
			wledFxMethod: "mode_solid_glitter",
			wledUiName: "Solid Glitter",

			proposedName: "Solid Glitter",
			description: "",
		},
		FX_MODE_SUNRISE:                 {
			wledIndex: WledEffectModeIndex.SUNRISE,
			wledFxMethod: "mode_sunrise",
			wledUiName: "Sunrise",

			proposedName: "Sunrise",
			description: "",
		},
		FX_MODE_PHASED:                  {
			wledIndex: WledEffectModeIndex.PHASED,
			wledFxMethod: "mode_phased",
			wledUiName: "Phased",

			proposedName: "Phased",
			description: "",
		},
		FX_MODE_TWINKLEUP:               {
			wledIndex: WledEffectModeIndex.TWINKLEUP,
			wledFxMethod: "mode_twinkleup",
			wledUiName: "Twinkleup",

			proposedName: "Twinkleup",
			description: "",
		},
		FX_MODE_NOISEPAL:                {
			wledIndex: WledEffectModeIndex.NOISEPAL,
			wledFxMethod: "mode_noisepal",
			wledUiName: "Noise Pal",

			proposedName: "Noise Pal",
			description: "",
		},
		FX_MODE_SINEWAVE:                {
			wledIndex: WledEffectModeIndex.SINEWAVE,
			wledFxMethod: "mode_sinewave",
			wledUiName: "Sine",

			proposedName: "Sine",
			description: "",
		},
		FX_MODE_PHASEDNOISE:             {
			wledIndex: WledEffectModeIndex.PHASEDNOISE,
			wledFxMethod: "mode_phased_noise",
			wledUiName: "Phased Noise",

			proposedName: "Phased Noise",
			description: "",
		},
		FX_MODE_FLOW:                    {
			wledIndex: WledEffectModeIndex.FLOW,
			wledFxMethod: "mode_flow",
			wledUiName: "Flow",

			proposedName: "Flow",
			description: "",
		},
		FX_MODE_CHUNCHUN:                {
			wledIndex: WledEffectModeIndex.CHUNCHUN,
			wledFxMethod: "mode_chunchun",
			wledUiName: "Chunchun",

			proposedName: "Chunchun",
			description: "",
		},
		FX_MODE_DANCING_SHADOWS:         {
			wledIndex: WledEffectModeIndex.DANCING_SHADOWS,
			wledFxMethod: "mode_dancing_shadows",
			wledUiName: "Dancing Shadows",

			proposedName: "Dancing Shadows",
			description: "",
		},
		FX_MODE_WASHING_MACHINE:         {
			wledIndex: WledEffectModeIndex.WASHING_MACHINE,
			wledFxMethod: "mode_washing_machine",
			wledUiName: "Washing Machine",

			proposedName: "Washing Machine",
			description: "",
		},
		FX_MODE_CANDY_CANE:              {
			wledIndex: WledEffectModeIndex.CANDY_CANE,
			wledFxMethod: "mode_candy_cane",
			wledUiName: "Candy Cane",

			proposedName: "Candy Cane",
			description: "",
		},
		FX_MODE_BLENDS:                  {
			wledIndex: WledEffectModeIndex.BLENDS,
			wledFxMethod: "mode_blends",
			wledUiName: "Blends",

			proposedName: "Blends",
			description: "",
		},
	}
)

type UiEffectModeId = 
		"FX_MODE_STATIC"
	| "FX_MODE_BLINK"
	| "FX_MODE_BREATH"
	| "FX_MODE_COLOR_WIPE"
	| "FX_MODE_COLOR_WIPE_RANDOM"
	| "FX_MODE_RANDOM_COLOR"
	| "FX_MODE_COLOR_SWEEP"
	| "FX_MODE_DYNAMIC"
	| "FX_MODE_RAINBOW"
	| "FX_MODE_RAINBOW_CYCLE"
	| "FX_MODE_SCAN"
	| "FX_MODE_DUAL_SCAN"
	| "FX_MODE_FADE"
	| "FX_MODE_THEATER_CHASE"
	| "FX_MODE_THEATER_CHASE_RAINBOW"
	| "FX_MODE_RUNNING_LIGHTS"
	| "FX_MODE_SAW"
	| "FX_MODE_TWINKLE"
	| "FX_MODE_DISSOLVE"
	| "FX_MODE_DISSOLVE_RANDOM"
	| "FX_MODE_SPARKLE"
	| "FX_MODE_FLASH_SPARKLE"
	| "FX_MODE_HYPER_SPARKLE"
	| "FX_MODE_STROBE"
	| "FX_MODE_STROBE_RAINBOW"
	| "FX_MODE_MULTI_STROBE"
	| "FX_MODE_BLINK_RAINBOW"
	| "FX_MODE_ANDROID"
	| "FX_MODE_CHASE_COLOR"
	| "FX_MODE_CHASE_RANDOM"
	| "FX_MODE_CHASE_RAINBOW"
	| "FX_MODE_CHASE_FLASH"
	| "FX_MODE_CHASE_FLASH_RANDOM"
	| "FX_MODE_CHASE_RAINBOW_WHITE"
	| "FX_MODE_COLORFUL"
	| "FX_MODE_TRAFFIC_LIGHT"
	| "FX_MODE_COLOR_SWEEP_RANDOM"
	| "FX_MODE_RUNNING_COLOR"
	| "FX_MODE_RUNNING_RED_BLUE"
	| "FX_MODE_RUNNING_RANDOM"
	| "FX_MODE_LARSON_SCANNER"
	| "FX_MODE_COMET"
	| "FX_MODE_FIREWORKS"
	| "FX_MODE_RAIN"
	| "FX_MODE_MERRY_CHRISTMAS"
	| "FX_MODE_FIRE_FLICKER"
	| "FX_MODE_GRADIENT"
	| "FX_MODE_LOADING"
	| "FX_MODE_POLICE"
	| "FX_MODE_POLICE_ALL"
	| "FX_MODE_TWO_DOTS"
	| "FX_MODE_TWO_AREAS"
	| "FX_MODE_CIRCUS_COMBUSTUS"
	| "FX_MODE_HALLOWEEN"
	| "FX_MODE_TRICOLOR_CHASE"
	| "FX_MODE_TRICOLOR_WIPE"
	| "FX_MODE_TRICOLOR_FADE"
	| "FX_MODE_LIGHTNING"
	| "FX_MODE_ICU"
	| "FX_MODE_MULTI_COMET"
	| "FX_MODE_DUAL_LARSON_SCANNER"
	| "FX_MODE_RANDOM_CHASE"
	| "FX_MODE_OSCILLATE"
	| "FX_MODE_PRIDE_2015"
	| "FX_MODE_JUGGLE"
	| "FX_MODE_PALETTE"
	| "FX_MODE_FIRE_2012"
	| "FX_MODE_COLORWAVES"
	| "FX_MODE_BPM"
	| "FX_MODE_FILLNOISE8"
	| "FX_MODE_NOISE16_1"
	| "FX_MODE_NOISE16_2"
	| "FX_MODE_NOISE16_3"
	| "FX_MODE_NOISE16_4"
	| "FX_MODE_COLORTWINKLE"
	| "FX_MODE_LAKE"
	| "FX_MODE_METEOR"
	| "FX_MODE_METEOR_SMOOTH"
	| "FX_MODE_RAILWAY"
	| "FX_MODE_RIPPLE"
	| "FX_MODE_TWINKLEFOX"
	| "FX_MODE_TWINKLECAT"
	| "FX_MODE_HALLOWEEN_EYES"
	| "FX_MODE_STATIC_PATTERN"
	| "FX_MODE_TRI_STATIC_PATTERN"
	| "FX_MODE_SPOTS"
	| "FX_MODE_SPOTS_FADE"
	| "FX_MODE_GLITTER"
	| "FX_MODE_CANDLE"
	| "FX_MODE_STARBURST"
	| "FX_MODE_EXPLODING_FIREWORKS"
	| "FX_MODE_BOUNCINGBALLS"
	| "FX_MODE_SINELON"
	| "FX_MODE_SINELON_DUAL"
	| "FX_MODE_SINELON_RAINBOW"
	| "FX_MODE_POPCORN"
	| "FX_MODE_DRIP"
	| "FX_MODE_PLASMA"
	| "FX_MODE_PERCENT"
	| "FX_MODE_RIPPLE_RAINBOW"
	| "FX_MODE_HEARTBEAT"
	| "FX_MODE_PACIFICA"
	| "FX_MODE_CANDLE_MULTI"
	| "FX_MODE_SOLID_GLITTER"
	| "FX_MODE_SUNRISE"
	| "FX_MODE_PHASED"
	| "FX_MODE_TWINKLEUP"
	| "FX_MODE_NOISEPAL"
	| "FX_MODE_SINEWAVE"
	| "FX_MODE_PHASEDNOISE"
	| "FX_MODE_FLOW"
	| "FX_MODE_CHUNCHUN"
	| "FX_MODE_DANCING_SHADOWS"
	| "FX_MODE_WASHING_MACHINE"
	| "FX_MODE_CANDY_CANE"
	| "FX_MODE_BLENDS"
	;