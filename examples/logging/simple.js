var util = require("../../");

var logger = util.Logging.getLogger("default", true);
logger.addHandler(new util.Logging.StreamHandler());

if (util.Logging.ConsolaHandler.isReady()) {
    logger.addHandler(new util.Logging.ConsolaHandler());
}

logger.info("Info Message");
logger.info("Error Message");
