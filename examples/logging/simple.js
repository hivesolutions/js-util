var util = require("../../");

var logger = util.Logging.getLogger("default", {
    level: util.Logging.constants.DEBUG
});
logger.addHandler(new util.Logging.StreamHandler());

if (util.Logging.ConsolaHandler.isReady()) {
    logger.addHandler(new util.Logging.ConsolaHandler());
}

logger.debug("Debug Message");
logger.info("Info Message");
logger.error("Error Message");
