namespace MCGUI {
	export namespace Screen {
		export enum Types {
			ACHIEVEMENTS,
			CHAT,
			CREATE_WORLD,
			CREDITS,
			ENTITY,
			FEEDBACK,
			GAMEPLAY,
			HOW_TO_PLAY,
			INVENTORY,
			MARKETPLACE,
			MODAL,
			NATIVE_TILE,
			PAUSE,
			PERSONA,
			PLAY,
			PLAYER_PERMISSIONS,
			PROFILE,
			REALMS,
			SETTINGS,
			SETTINGS_IN_WORLD,
			WORLD,
			XBOX,
		}
		export const List = {
			"ACHIEVEMENTS": [
				"/achievements",
				"/achievements/completed",
				"/achievements/locked"
			],
			"CHAT": [
				" - chat_setting_popup",
				" - options.resetSettings - options.resetSettings.popUp",
				"chat_screen"
			],
			"CREATE_WORLD": [
				"screen_world_create - addon_tab",
				"screen_world_create - game_tab",
				"screen_world_create - level_texture_pack_tab",
				"screen_world_create - multiplayer_tab",
				"world_templates_screen"
			],
			"CREDITS": [
				"credits_screen"
			],
			"ENTITY": [
				"horse_screen"
			],
			"FEEDBACK": [
				" - feedbackScreen.title - feedbackScreen.body"
			],
			"GAMEPLAY": [
				"emote_wheel_screen",
				"in_game_play_screen"
			],
			"HOW_TO_PLAY": [
				"how_to_play_screen"
			],
			"INVENTORY": [
				"creative_inventory_screen",
				"inventory_screen",
				"inventory_screen_pocket",
				"survival_inventory_screen"
			],
			"MARKETPLACE": [
				"store_data_driven_screen - store_home_screen",
				"store_item_list_screen - _query:MarketplaceDurableCatalog_V1.2___(AndTags)_(OrTags)_",
				"store_item_list_screen - _worldtemplate_search_results"
			],
			"MODAL": [
				"modal_progress_screen",
				"modal_progress_screen - begin_leaving_world",
				"modal_progress_screen - load_options"
			],
			"NATIVE_TILE": [
				"anvil_screen",
				"barrel_screen",
				"beacon_screen",
				"blast_furnace_screen",
				"book_screen",
				"brewing_stand_screen",
				"cartography_screen",
				"dispenser_screen",
				"dropper_screen",
				"ender_chest_screen",
				"furnace_screen",
				"grindstone_screen",
				"hopper_screen",
				"loom_screen",
				"shulker_box_screen",
				"small_chest_screen",
				"smithing_table_screen",
				"smoker_screen",
				"stonecutter_screen"
			],
			"PAUSE": [
				"pause_screen"
			],
			"PERSONA": [
				"persona_screen - customization - categories",
				"persona_screen - customization - subCategories"
			],
			"PLAY": [
				"add_external_server_screen_new",
				"play_screen - friends",
				"play_screen - servers",
				"play_screen - worlds"
			],
			"PLAYER_PERMISSIONS": [
				"permissions_screen"
			],
			"PROFILE": [
				"profile_screen"
			],
			"REALMS": [
				" - join_by_code",
				"choose_realm_screen",
				"realms_plus_pdp_screenbuy_now_tab",
				"realms_plus_pdp_screencontent_tab",
				"realms_plus_pdp_screenfaq_tab",
				"realms_plus_pdp_screenrealmsPlus_tab"
			],
			"SETTINGS": [
				" - options.resetSettings - options.resetSettings.popUp",
				"safe_zone_screen",
				"screen_controls_and_settings - accessibility_tab",
				"screen_controls_and_settings - controller_tab",
				"screen_controls_and_settings - global_texture_pack_tab",
				"screen_controls_and_settings - how_to_play",
				"screen_controls_and_settings - keyboard_and_mouse_tab",
				"screen_controls_and_settings - language_tab",
				"screen_controls_and_settings - profile_tab",
				"screen_controls_and_settings - sound_tab",
				"screen_controls_and_settings - storage_tab",
				"screen_controls_and_settings - touch_tab",
				"screen_controls_and_settings - video_tab",
				"screen_controls_and_settings - view_subscriptions_tab"
			],
			"SETTINGS_IN_WORLD": [
				"screen_world_controls_and_settings - accessibility_tab",
				"screen_world_controls_and_settings - addon_tab",
				"screen_world_controls_and_settings - controller_tab",
				"screen_world_controls_and_settings - game_tab",
				"screen_world_controls_and_settings - global_texture_pack_tab",
				"screen_world_controls_and_settings - how_to_play",
				"screen_world_controls_and_settings - keyboard_and_mouse_tab",
				"screen_world_controls_and_settings - level_texture_pack_tab",
				"screen_world_controls_and_settings - multiplayer_tab",
				"screen_world_controls_and_settings - profile_tab",
				"screen_world_controls_and_settings - sound_tab",
				"screen_world_controls_and_settings - touch_tab",
				"screen_world_controls_and_settings - video_tab",
				"screen_world_controls_and_settings - view_subscriptions_tab"
			],
			"WORLD": [
				"world_loading_progress_screen - local_world_load",
				"world_loading_progress_screen - play_progress",
				"world_saving_progress_screen - world_loading_progress_screen"
			],
			"XBOX": [
				"xbl_friend_finder"
			]
		}
		export interface SubScreenInfo {
			parent: string,
			childs: string[]
		}
		export interface ScreenInfo {
			type: string,
			name: string,
			sub: SubScreenInfo | null
		}
		export function findCurrentType(): ScreenInfo {
			var currentType: string | null = null;
			var currentName: string | null = null;
			for (let name in List) {
				let isCurrent = false
				const screens = List[name]
				screens.forEach((screenName: string) => {
					isCurrent = isCurrentScreen(screenName)
					if (isCurrent) {
						currentName = screenName
						currentType = name
					}
				})
				if (isCurrent) break; else continue
			}
			return {
				type: currentType,
				name: currentName,
				sub: findSubScreen(currentName)
			}
		}
		export function findSubScreen(currentName: string) {
			var subScreen: SubScreenInfo = null
			if (typeof currentName == "string")
				if (currentName.match(" - ")) {
					let splitted = currentName.split(" - ")
					let childs = []
					for (let i = 1; i < splitted.length; i++) {
						childs.push(splitted[i])
					}
					subScreen = {
						parent: splitted[0],
						childs
					}
				}
			return subScreen
		}
		export function isCurrentScreen(name: string) {
			if (Latest.current == name)
				return true
			return false
		}

		export const Latest = {
			current: "",
			last: "",
			isPush: false,
			type: "",
			enumType: 0
		}

		function updateScreens(name: string, lastName: string, event: boolean) {
			Latest.current = name
			Latest.last = lastName
			Latest.isPush = event
			Latest.type = findCurrentType().type
			Latest.enumType = Types[Latest.type]
		}

		Callback.addCallback("NativeGuiChanged", (name: string, lastName: string, isPushEvent: boolean) => {
			updateScreens(name, lastName, isPushEvent)
			console.info(`Latest: \n${JSON.stringify(Latest, null, 4)}`)
			// console.debug(`${isPushEvent ? lastName + " --> " + name : name + " <-- " + lastName} (${isPushEvent ? "pushed" : "popped"}) (${CurrentState == State.inGui ? "inGui" : CurrentState == State.inWorld ? "inWorld" : "None"})`, `[ItemName.ts] ItemName Callback.NativeGuiChanged`)
		})
	}
	export namespace SpecialChars {
		export const List = {
			"armor": "0xE101",
			"code_builder_button": "0xE103",
			"craftable_toggle_off": "0xE0A1",
			"craftable_toggle_on": "0xE0A0",
			"hollow_star": "0xE106",
			"immersive_reader_button": "0xE104",
			"light_mouse_button": "0xE073",
			"light_mouse_left_button": "0xE070",
			"light_mouse_middle_button": "0xE072",
			"light_mouse_right_button": "0xE071",
			"minecoin": "0xE102",
			"mouse_button": "0xE063",
			"mouse_left_button": "0xE060",
			"mouse_middle_button": "0xE062",
			"mouse_right_button": "0xE061",
			"nbsp": "0xE0FF",
			"ps4_bumper_left": "0xE024",
			"ps4_bumper_right": "0xE025",
			"ps4_dpad_down": "0xE02E",
			"ps4_dpad_left": "0xE02D",
			"ps4_dpad_right": "0xE02F",
			"ps4_dpad_up": "0xE02C",
			"ps4_face_button_down": "0xE020",
			"ps4_face_button_left": "0xE022",
			"ps4_face_button_right": "0xE021",
			"ps4_face_button_up": "0xE023",
			"ps4_select": "0xE028",
			"ps4_start": "0xE029",
			"ps4_stick_left": "0xE02A",
			"ps4_stick_right": "0xE02B",
			"ps4_trigger_left": "0xE026",
			"ps4_trigger_right": "0xE027",
			"rift_0": "0xE0E0",
			"rift_A": "0xE0E1",
			"rift_B": "0xE0E2",
			"rift_X": "0xE0E9",
			"rift_Y": "0xE0EA",
			"rift_left_grab": "0xE0E3",
			"rift_left_stick": "0xE0E5",
			"rift_left_trigger": "0xE0E7",
			"rift_right_grab": "0xE0E4",
			"rift_right_stick": "0xE0E6",
			"rift_right_trigger": "0xE0E8",
			"shank": "0xE100",
			"solid_star": "0xE107",
			"switch_bumper_left": "0xE044",
			"switch_bumper_right": "0xE045",
			"switch_dpad_down": "0xE04E",
			"switch_dpad_left": "0xE04D",
			"switch_dpad_right": "0xE04F",
			"switch_dpad_up": "0xE04C",
			"switch_face_button_down": "0xE040",
			"switch_face_button_left": "0xE042",
			"switch_face_button_right": "0xE041",
			"switch_face_button_up": "0xE043",
			"switch_select": "0xE048",
			"switch_start": "0xE049",
			"switch_stick_left": "0xE04A",
			"switch_stick_right": "0xE04B",
			"switch_trigger_left": "0xE046",
			"switch_trigger_right": "0xE047",
			"tip_face_button_down": "0xE010",
			"tip_face_button_left": "0xE012",
			"tip_face_button_right": "0xE011",
			"tip_face_button_up": "0xE013",
			"tip_left_stick": "0xE075",
			"tip_left_trigger": "0xE06E",
			"tip_right_stick": "0xE076",
			"tip_right_trigger": "0xE06F",
			"tip_touch_back": "0xE067",
			"tip_touch_fly_down": "0xE06D",
			"tip_touch_fly_up": "0xE06C",
			"tip_touch_forward": "0xE065",
			"tip_touch_inventory": "0xE06B",
			"tip_touch_jump": "0xE069",
			"tip_touch_left": "0xE066",
			"tip_touch_right": "0xE068",
			"tip_touch_sneak": "0xE06A",
			"token": "0xE102",
			"touch_back": "0xE082",
			"touch_fly_down": "0xE087",
			"touch_fly_up": "0xE086",
			"touch_forward": "0xE080",
			"touch_jump": "0xE084",
			"touch_left": "0xE081",
			"touch_right": "0xE083",
			"touch_sneak": "0xE085",
			"windowsmr_left_grab": "0xE0C0",
			"windowsmr_left_stick": "0xE0C3",
			"windowsmr_left_touchpad": "0xE0C5",
			"windowsmr_left_touchpad_horizontal": "0xE0C6",
			"windowsmr_left_touchpad_vertical": "0xE0C7",
			"windowsmr_left_trigger": "0xE0CB",
			"windowsmr_menu": "0xE0C2",
			"windowsmr_right_grab": "0xE0C1",
			"windowsmr_right_stick": "0xE0C4",
			"windowsmr_right_touchpad": "0xE0C8",
			"windowsmr_right_touchpad_horizontal": "0xE0C9",
			"windowsmr_right_touchpad_vertical": "0xE0CA",
			"windowsmr_right_trigger": "0xE0CC",
			"windowsmr_windows": "0xE0CD",
			"xbox_bumper_left": "0xE004",
			"xbox_bumper_right": "0xE005",
			"xbox_dpad_down": "0xE00E",
			"xbox_dpad_left": "0xE00D",
			"xbox_dpad_right": "0xE00F",
			"xbox_dpad_up": "0xE00C",
			"xbox_face_button_down": "0xE000",
			"xbox_face_button_left": "0xE002",
			"xbox_face_button_right": "0xE001",
			"xbox_face_button_up": "0xE003",
			"xbox_select": "0xE008",
			"xbox_start": "0xE009",
			"xbox_stick_left": "0xE00A",
			"xbox_stick_right": "0xE00B",
			"xbox_trigger_left": "0xE006",
			"xbox_trigger_right": "0xE007"
		}
		export function get(name: string) {
			return String.fromCodePoint(List[name]) || null
		}
	}
}