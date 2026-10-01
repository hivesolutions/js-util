var util = require("../../");

var logger = util.Logging.getLogger("default", {
    level: util.Logging.constants.DEBUG
});
logger.addHandler(new util.Logging.StreamHandler());

if (util.Logging.ConsolaHandler.isReady()) {
    logger.addHandler(new util.Logging.ConsolaHandler());
}

logger.setFormatter(new util.Logging.SimpleFormatter("{asctime} {level} {name} {message}"));

logger.debug("Debug Message");
logger.info("Info Message", { key: "value" });
logger.error("Error Message");
