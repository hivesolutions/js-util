var util = require("../../");

var logger = util.Logging.getLogger("default");
logger.addHandler(new util.Logging.StreamHandler());

logger.info("Info Message");
logger.info("Error Message");
