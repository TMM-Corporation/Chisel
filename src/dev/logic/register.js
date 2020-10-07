ScriptingManager.readAllResources()

BlockManager.registerList([
    "test_block"
])

Game.dialogMessage(JSON.stringify(ScriptingManager.namespaces), "ScriptingManager.readAllResources")