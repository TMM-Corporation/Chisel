UI.getContext().runOnUiThread(new java.lang.Runnable({
	run: function () {
		UI.getContext().getWindow().setFlags(
			android.view.WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
			android.view.WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
		)
		UI.getContext().getWindow().getAttributes().layoutInDisplayCutoutMode = android.view.WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
	}
}))

var Color = android.graphics.Color
function getRandomArbitrary(min: number, max: number) {
	return Math.random() * (max - min) + min
}