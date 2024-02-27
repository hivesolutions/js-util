/* eslint-disable */

/**
 * Prism: Lightweight, robust, elegant syntax highlighting MIT license
 * http://www.opensource.org/licenses/mit-license.php/
 *
 * @author Lea Verou http://lea.verou.me
 */

var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;

var _ = (self.Prism = {
    util: {
        type: function (o) {
            return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
        },
        clone: function (o) {
            var type = _.util.type(o);
            switch (type) {
                case "Object":
                    var clone = {};

                    for (var key in o) {
                        if (o.hasOwnProperty(key)) {
                            clone[key] = _.util.clone(o[key]);
                        }
                    }

                    return clone;

                case "Array":
                    return o.slice();
            }
            return o;
        }
    },
    languages: {
        extend: function (id, redef) {
            var lang = _.util.clone(_.languages[id]);

            for (var key in redef) {
                lang[key] = redef[key];
            }

            return lang;
        },
        insertBefore: function (inside, before, insert, root) {
            root = root || _.languages;
            var grammar = root[inside];
            var ret = {};

            for (var token in grammar) {
                if (grammar.hasOwnProperty(token)) {
                    if (token === before) {
                        for (var newToken in insert) {
                            if (insert.hasOwnProperty(newToken)) {
                                ret[newToken] = insert[newToken];
                            }
                        }
                    }

                    ret[token] = grammar[token];
                }
            }

            return (root[inside] = ret);
        },
        DFS: function (o, callback) {
            for (var i in o) {
                callback.call(o, i, o[i]);

                if (_.util.type(o) === "Object") {
                    _.languages.DFS(o[i], callback);
                }
            }
        }
    },
    highlightAll: function (async, callback) {
        var elements = document.querySelectorAll(
            'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
        );

        for (var i = 0, element; (element = elements[i++]); ) {
            _.highlightElement(element, async === true, callback);
        }
    },
    highlightElement: function (element, async, callback) {
        var language;
        var grammar;
        var parent = element;

        while (parent && !lang.test(parent.className)) {
            parent = parent.parentNode;
        }

        if (parent) {
            language = (parent.className.match(lang) || [null, ""])[1];
            grammar = _.languages[language];
        }

        if (!grammar) {
            return;
        }

        element.className =
            element.className.replace(lang, "").replace(/\s+/g, " ") + " language-" + language;

        parent = element.parentNode;

        if (/pre/i.test(parent.nodeName)) {
            parent.className =
                parent.className.replace(lang, "").replace(/\s+/g, " ") + " language-" + language;
        }

        var code = element.textContent;

        if (!code) {
            return;
        }

        code = code
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/\u00a0/g, " ");

        var env = {
            element: element,
            language: language,
            grammar: grammar,
            code: code
        };

        _.hooks.run("before-highlight", env);

        if (async && self.Worker) {
            var worker = new Worker(_.filename);

            worker.onmessage = function (evt) {
                env.highlightedCode = Token.stringify(JSON.parse(evt.data), language);

                _.hooks.run("before-insert", env);

                env.element.innerHTML = env.highlightedCode;

                callback && callback.call(env.element);
                _.hooks.run("after-highlight", env);
            };

            worker.postMessage(
                JSON.stringify({
                    language: env.language,
                    code: env.code
                })
            );
        } else {
            env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

            _.hooks.run("before-insert", env);

            env.element.innerHTML = env.highlightedCode;

            callback && callback.call(element);

            _.hooks.run("after-highlight", env);
        }
    },

    highlight: function (text, grammar, language) {
        return Token.stringify(_.tokenize(text, grammar), language);
    },

    tokenize: function (text, grammar, language) {
        var Token = _.Token;
        var strarr = [text];
        var rest = grammar.rest;
        var token = null;

        if (rest) {
            for (token in rest) {
                grammar[token] = rest[token];
            }

            delete grammar.rest;
        }

        tokenloop: for (token in grammar) {
            if (!grammar.hasOwnProperty(token) || !grammar[token]) {
                continue;
            }

            var pattern = grammar[token];
            var inside = pattern.inside;
            var lookbehind = !!pattern.lookbehind;
            var lookbehindLength = 0;

            pattern = pattern.pattern || pattern;

            for (var i = 0; i < strarr.length; i++) {
                var str = strarr[i];

                if (strarr.length > text.length) {
                    break tokenloop;
                }

                if (str instanceof Token) {
                    continue;
                }

                pattern.lastIndex = 0;

                var match = pattern.exec(str);

                if (match) {
                    if (lookbehind) {
                        lookbehindLength = match[1].length;
                    }

                    var from = match.index - 1 + lookbehindLength;

                    match = match[0].slice(lookbehindLength);

                    var len = match.length;
                    var to = from + len;
                    var before = str.slice(0, from + 1);
                    var after = str.slice(to + 1);

                    var args = [i, 1];

                    if (before) {
                        args.push(before);
                    }

                    var wrapped = new Token(token, inside ? _.tokenize(match, inside) : match);

                    args.push(wrapped);

                    if (after) {
                        args.push(after);
                    }

                    Array.prototype.splice.apply(strarr, args);
                }
            }
        }

        return strarr;
    },

    hooks: {
        all: {},

        add: function (name, callback) {
            var hooks = _.hooks.all;

            hooks[name] = hooks[name] || [];

            hooks[name].push(callback);
        },

        run: function (name, env) {
            var callbacks = _.hooks.all[name];

            if (!callbacks || !callbacks.length) {
                return;
            }

            for (var i = 0, callback; (callback = callbacks[i++]); ) {
                callback(env);
            }
        }
    }
});

var Token = (_.Token = function (type, content) {
    this.type = type;
    this.content = content;
});

Token.stringify = function (o, language, parent) {
    if (typeof o === "string") {
        return o;
    }

    if (Object.prototype.toString.call(o) === "[object Array]") {
        return o
            .map(function (element) {
                return Token.stringify(element, language, o);
            })
            .join("");
    }

    var env = {
        type: o.type,
        content: Token.stringify(o.content, language, parent),
        tag: "span",
        classes: ["token", o.type],
        attributes: {},
        language: language,
        parent: parent
    };

    if (env.type === "comment") {
        env.attributes["spellcheck"] = "true";
    }

    _.hooks.run("wrap", env);

    var attributes = "";

    for (var name in env.attributes) {
        attributes += name + '="' + (env.attributes[name] || "") + '"';
    }

    return (
        "<" +
        env.tag +
        ' class="' +
        env.classes.join(" ") +
        '" ' +
        attributes +
        ">" +
        env.content +
        "</" +
        env.tag +
        ">"
    );
};

if (!self.document) {
    self.addEventListener(
        "message",
        function (evt) {
            var message = JSON.parse(evt.data);
            var lang = message.language;
            var code = message.code;

            self.postMessage(JSON.stringify(_.tokenize(code, _.languages[lang])));
            self.close();
        },
        false
    );
}

Prism.languages.markup = {
    comment: /&lt;!--[\w\W]*?-->/g,
    prolog: /&lt;\?.+?\?>/,
    doctype: /&lt;!DOCTYPE.+?>/,
    cdata: /&lt;!\[CDATA\[[\w\W]*?]]>/i,
    etag: {
        pattern: /&lt;\/?[\w:-]+\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|\w+))?\s*)*\/?>/gi,
        inside: {
            etag: {
                pattern: /^&lt;\/?[\w:-]+/i,
                inside: {
                    punctuation: /^&lt;\/?/,
                    namespace: /^[\w-]+?:/
                }
            },
            "attr-value": {
                pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/gi,
                inside: {
                    punctuation: /=|>|"/g
                }
            },
            punctuation: /\/?>/g,
            "attr-name": {
                pattern: /[\w:-]+/g,
                inside: {
                    namespace: /^[\w-]+?:/
                }
            }
        }
    },
    entity: /&amp;#?[\da-z]{1,8};/gi
};

Prism.hooks.add("wrap", function (env) {
    if (env.type === "entity") {
        env.attributes["title"] = env.content.replace(/&amp;/, "&");
    }
});
Prism.languages.css = {
    comment: /\/\*[\w\W]*?\*\//g,
    atrule: {
        pattern: /@[\w-]+?.*?(;|(?=\s*{))/gi,
        inside: {
            punctuation: /[;:]/g
        }
    },
    url: /url\((["']?).*?\1\)/gi,
    selector: /[^\{\}\s][^\{\};]*(?=\s*\{)/g,
    property: /(\b|\B)[\w-]+(?=\s*:)/gi,
    string: /("|')(\\?.)*?\1/g,
    important: /\B!important\b/gi,
    ignore: /&(lt|gt|amp);/gi,
    punctuation: /[\{\};:]/g
};

if (Prism.languages.markup) {
    Prism.languages.insertBefore("markup", "etag", {
        style: {
            pattern: /(&lt;|<)style[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/style(>|&gt;)/gi,
            inside: {
                etag: {
                    pattern: /(&lt;|<)style[\w\W]*?(>|&gt;)|(&lt;|<)\/style(>|&gt;)/gi,
                    inside: Prism.languages.markup.etag.inside
                },
                rest: Prism.languages.css
            }
        }
    });
}

Prism.languages.clike = {
    comment: {
        pattern: /(^|[^\\])(\/\*[\w\W]*?\*\/|(^|[^:])\/\/.*?(\r?\n|$))/g,
        lookbehind: true
    },
    string: /("|')(\\?.)*?\1/g,
    "class-name": {
        pattern:
            /((?:(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/gi,
        lookbehind: true,
        inside: {
            punctuation: /(\.|\\)/
        }
    },
    keyword:
        /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/g,
    boolean: /\b(true|false)\b/g,
    function: {
        pattern: /[a-z0-9_]+\(/gi,
        inside: {
            punctuation: /\(/
        }
    },
    number: /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,
    operator: /[-+]{1,2}|!|&lt;=?|>=?|={1,3}|(&amp;){1,2}|\|?\||\?|\*|\/|\~|\^|\%/g,
    ignore: /&(lt|gt|amp);/gi,
    punctuation: /[{}[\];(),.:]/g
};

Prism.languages.javascript = Prism.languages.extend("clike", {
    keyword:
        /\b(var|let|if|else|while|do|for|return|in|instanceof|function|new|with|typeof|try|throw|catch|finally|null|break|continue)\b/g,
    number: /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?|NaN|-?Infinity)\b/g
});

Prism.languages.insertBefore("javascript", "keyword", {
    regex: {
        pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/g,
        lookbehind: true
    }
});

if (Prism.languages.markup) {
    Prism.languages.insertBefore("markup", "etag", {
        script: {
            pattern: /(&lt;|<)script[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/script(>|&gt;)/gi,
            inside: {
                etag: {
                    pattern: /(&lt;|<)script[\w\W]*?(>|&gt;)|(&lt;|<)\/script(>|&gt;)/gi,
                    inside: Prism.languages.markup.etag.inside
                },
                rest: Prism.languages.javascript
            }
        }
    });
}
Prism.languages.java = Prism.languages.extend("clike", {
    keyword:
        /\b(abstract|continue|for|new|switch|assert|default|goto|package|synchronized|boolean|do|if|private|this|break|double|implements|protected|throw|byte|else|import|public|throws|case|enum|instanceof|return|transient|catch|extends|int|short|try|char|final|interface|static|void|class|finally|long|strictfp|volatile|const|float|native|super|while)\b/g,
    number: /\b0b[01]+\b|\b0x[\da-f]*\.?[\da-fp\-]+\b|\b\d*\.?\d+[e]?[\d]*[df]\b|\W\d*\.?\d+\b/gi,
    operator: {
        pattern:
            /([^\.]|^)([-+]{1,2}|!|=?&lt;|=?&gt;|={1,2}|(&amp;){1,2}|\|?\||\?|\*|\/|%|\^|(&lt;){2}|($gt;){2,3}|:|~)/g,
        lookbehind: true
    }
});

/**
 * Original by Aaron Harun:
 * http://aahacreative.com/2012/07/31/php-syntax-highlighting-prism/ Modified by
 * Miles Johnson: http://milesj.me
 *
 * Supports the following: - Extends clike syntax - Support for PHP 5.3 and 5.4
 * (namespaces, traits, etc) - Smarter constant and function matching
 *
 * Adds the following new token classes: constant, delimiter, variable,
 * function, package
 */

Prism.languages.php = Prism.languages.extend("clike", {
    keyword:
        /\b(and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|extends|private|protected|parent|static|throw|null|echo|print|trait|namespace|use|final|yield|goto|instanceof|finally|try|catch)\b/gi,
    constant: /\b[A-Z0-9_]{2,}\b/g
});

Prism.languages.insertBefore("php", "keyword", {
    delimiter: /(\?>|&lt;\?php|&lt;\?)/gi,
    variable: /(\$\w+)\b/gi,
    package: {
        pattern: /(\\|namespace\s+|use\s+)[\w\\]+/g,
        lookbehind: true,
        inside: {
            punctuation: /\\/
        }
    }
});

Prism.languages.insertBefore("php", "operator", {
    property: {
        pattern: /(->)[\w]+/g,
        lookbehind: true
    }
});

if (Prism.languages.markup) {
    Prism.hooks.add("before-highlight", function (env) {
        if (env.language !== "php") {
            return;
        }

        env.tokenStack = [];

        env.code = env.code.replace(
            /(?:&lt;\?php|&lt;\?|<\?php|<\?)[\w\W]*?(?:\?&gt;|\?>)/gi,
            function (match) {
                env.tokenStack.push(match);

                return "{{{PHP" + env.tokenStack.length + "}}}";
            }
        );
    });

    Prism.hooks.add("after-highlight", function (env) {
        if (env.language !== "php") {
            return;
        }

        for (var i = 0, t; (t = env.tokenStack[i]); i++) {
            env.highlightedCode = env.highlightedCode.replace(
                "{{{PHP" + (i + 1) + "}}}",
                Prism.highlight(t, env.grammar, "php")
            );
        }

        env.element.innerHTML = env.highlightedCode;
    });

    Prism.hooks.add("wrap", function (env) {
        if (env.language === "php" && env.type === "markup") {
            env.content = env.content.replace(
                /(\{\{\{PHP[0-9]+\}\}\})/g,
                '<span class="token php">$1</span>'
            );
        }
    });

    Prism.languages.insertBefore("php", "comment", {
        markup: {
            pattern: /(&lt;|<)[^?]\/?(.*?)(>|&gt;)/g,
            inside: Prism.languages.markup
        },
        php: /\{\{\{PHP[0-9]+\}\}\}/g
    });
}

Prism.languages.insertBefore("php", "variable", {
    this: /\$this/g,
    global: /\$_?(GLOBALS|SERVER|GET|POST|FILES|REQUEST|SESSION|ENV|COOKIE|HTTP_RAW_POST_DATA|argc|argv|php_errormsg|http_response_header)/g,
    scope: {
        pattern: /\b[\w\\]+::/g,
        inside: {
            keyword: /(static|self|parent)/,
            punctuation: /(::|\\)/
        }
    }
});

Prism.languages.coffeescript = Prism.languages.extend("javascript", {
    "block-comment": /([#]{3}\s*\r?\n(.*\s*\r*\n*)\s*?\r?\n[#]{3})/g,
    comment: /(\s|^)([#]{1}[^#^\r^\n]{2,}?(\r?\n|$))/g,
    keyword:
        /\b(this|window|delete|class|extends|namespace|extend|ar|let|if|else|while|do|for|each|of|return|in|instanceof|new|with|typeof|try|catch|finally|null|undefined|break|continue)\b/g
});

Prism.languages.insertBefore("coffeescript", "keyword", {
    function: {
        pattern: /[a-z|A-z]+\s*[:|=]\s*(\([.|a-z\s|,|:|{|}|\"|\'|=]*\))?\s*-&gt;/gi,
        inside: {
            "function-name": /[_?a-z-|A-Z-]+(\s*[:|=])| @[_?$?a-z-|A-Z-]+(\s*)| /g,
            operator: /[-+]{1,2}|!|=?&lt;|=?&gt;|={1,2}|(&amp;){1,2}|\|?\||\?|\*|\//g
        }
    },
    "attr-name": /[_?a-z-|A-Z-]+(\s*:)| @[_?$?a-z-|A-Z-]+(\s*)| /g
});

Prism.languages.scss = Prism.languages.extend("css", {
    comment: {
        pattern: /(^|[^\\])(\/\*[\w\W]*?\*\/|\/\/.*?(\r?\n|$))/g,
        lookbehind: true
    },
    atrule: /@[\w-]+(?=\s+(\(|\{|;))/gi,
    url: /([-a-z]+-)*url(?=\()/gi,
    selector:
        /([^@;\{\}\(\)]?([^@;\{\}\(\)]|&amp;|\#\{\$[-_\w]+\})+)(?=\s*\{(\}|\s|[^\}]+(:|\{)[^\}]+))/gm
});

Prism.languages.insertBefore("scss", "atrule", {
    keyword:
        /@(if|else if|else|for|each|while|import|extend|debug|warn|mixin|include|function|return)|(?=@for\s+\$[-_\w]+\s)+from/i
});

Prism.languages.insertBefore("scss", "property", {
    variable: /((\$[-_\w]+)|(#\{\$[-_\w]+\}))/i
});

Prism.languages.insertBefore("scss", "ignore", {
    placeholder: /%[-_\w]+/i,
    statement: /\B!(default|optional)\b/gi,
    boolean: /\b(true|false)\b/g,
    null: /\b(null)\b/g,
    operator: /\s+([-+]{1,2}|={1,2}|!=|\|?\||\?|\*|\/|\%)\s+/g
});

Prism.languages.bash = Prism.languages.extend("clike", {
    comment: {
        pattern: /(^|[^"{\\])(#.*?(\r?\n|$))/g,
        lookbehind: true
    },
    string: {
        pattern: /("|")(\\?[\s\S])*?\1/g,
        inside: {
            property: /\$([a-zA-Z0-9_#\?\-\*!@]+|\{[^\}]+\})/g
        }
    },
    keyword:
        /\b(if|then|else|elif|fi|for|break|continue|while|in|case|function|select|do|done|until|echo|exit|return|set|declare)\b/g
});

Prism.languages.insertBefore("bash", "keyword", {
    property: /\$([a-zA-Z0-9_#\?\-\*!@]+|\{[^}]+\})/g
});

Prism.languages.insertBefore("bash", "comment", {
    important: /(^#!\s*\/bin\/bash)|(^#!\s*\/bin\/sh)/g
});

Prism.languages.c = Prism.languages.extend("clike", {
    keyword:
        /\b(asm|typeof|inline|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while)\b/g,
    operator:
        /[-+]{1,2}|!=?|&lt;{1,2}=?|&gt;{1,2}=?|\-&gt;|={1,2}|\^|~|%|(&amp;){1,2}|\|?\||\?|\*|\//g
});

Prism.languages.insertBefore("c", "keyword", {
    property: /#\s*[a-zA-Z]+/g
});

Prism.languages.cpp = Prism.languages.extend("c", {
    keyword:
        /\b(alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|class|compl|const|constexpr|const_cast|continue|decltype|default|delete|delete\[\]|do|double|dynamic_cast|else|enum|explicit|export|extern|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|new\[\]|noexcept|nullptr|operator|private|protected|public|register|reinterpret_cast|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/g,
    operator:
        /[-+]{1,2}|!=?|&lt;{1,2}=?|&gt;{1,2}=?|\-&gt;|:{1,2}|={1,2}|\^|~|%|(&amp;){1,2}|\|?\||\?|\*|\/|\b(and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/g
});

Prism.languages.python = {
    comment: {
        pattern: /(^|[^\\])#.*?(\r?\n|$)/g,
        lookbehind: true
    },
    string: /("|')(\\?.)*?\1/g,
    keyword:
        /\b(as|assert|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|pass|print|raise|return|try|while|with|yield)\b/g,
    boolean: /\b(True|False)\b/g,
    number: /\b-?(0x)?\d*\.?[\da-f]+\b/g,
    operator:
        /[-+]{1,2}|=?&lt;|=?&gt;|!|={1,2}|(&){1,2}|(&amp;){1,2}|\|?\||\?|\*|\/|~|\^|%|\b(or|and|not)\b/g,
    ignore: /&(lt|gt|amp);/gi,
    punctuation: /[{}[\];(),.:]/g
};

Prism.languages.sql = {
    comment: {
        pattern: /(^|[^\\])(\/\*[\w\W]*?\*\/|((--)|(\/\/)).*?(\r?\n|$))/g,
        lookbehind: true
    },
    string: /("|')(\\?.)*?\1/g,
    keyword:
        /\b(ACTION|ADD|AFTER|ALGORITHM|ALTER|ANALYZE|APPLY|AS|ASC|AUTHORIZATION|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADE|CASCADED|CASE|CHAIN|CHAR VARYING|CHARACTER VARYING|CHECK|CHECKPOINT|CLOSE|CLUSTERED|COALESCE|COLUMN|COLUMNS|COMMENT|COMMIT|COMMITTED|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS|CONTAINSTABLE|CONTINUE|CONVERT|CREATE|CROSS|CURRENT|CURRENT_DATE|CURRENT_TIME|CURRENT_TIMESTAMP|CURRENT_USER|CURSOR|DATA|DATABASE|DATABASES|DATETIME|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE|DOUBLE PRECISION|DROP|DUMMY|DUMP|DUMPFILE|DUPLICATE KEY|ELSE|ENABLE|ENCLOSED BY|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPE|ESCAPED BY|EXCEPT|EXEC|EXECUTE|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR|FOR EACH ROW|FORCE|FOREIGN|FREETEXT|FREETEXTTABLE|FROM|FULL|FUNCTION|GEOMETRY|GEOMETRYCOLLECTION|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|IDENTITY|IDENTITY_INSERT|IDENTITYCOL|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTO|INVOKER|ISOLATION LEVEL|JOIN|KEY|KEYS|KILL|LANGUAGE SQL|LAST|LEFT|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONGBLOB|LONGTEXT|MATCH|MATCHED|MEDIUMBLOB|MEDIUMINT|MEDIUMTEXT|MERGE|MIDDLEINT|MODIFIES SQL DATA|MODIFY|MULTILINESTRING|MULTIPOINT|MULTIPOLYGON|NATIONAL|NATIONAL CHAR VARYING|NATIONAL CHARACTER|NATIONAL CHARACTER VARYING|NATIONAL VARCHAR|NATURAL|NCHAR|NCHAR VARCHAR|NEXT|NO|NO SQL|NOCHECK|NOCYCLE|NONCLUSTERED|NULLIF|NUMERIC|OF|OFF|OFFSETS|ON|OPEN|OPENDATASOURCE|OPENQUERY|OPENROWSET|OPTIMIZE|OPTION|OPTIONALLY|ORDER|OUT|OUTER|OUTFILE|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREV|PRIMARY|PRINT|PRIVILEGES|PROC|PROCEDURE|PUBLIC|PURGE|QUICK|RAISERROR|READ|READS SQL DATA|READTEXT|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEATABLE|REPLICATION|REQUIRE|RESTORE|RESTRICT|RETURN|RETURNS|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROWCOUNT|ROWGUIDCOL|ROWS?|RTREE|RULE|SAVE|SAVEPOINT|SCHEMA|SELECT|SERIAL|SERIALIZABLE|SESSION|SESSION_USER|SET|SETUSER|SHARE MODE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|START|STARTING BY|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLE|TABLES|TABLESPACE|TEMPORARY|TEMPTABLE|TERMINATED BY|TEXT|TEXTSIZE|THEN|TIMESTAMP|TINYBLOB|TINYINT|TINYTEXT|TO|TOP|TRAN|TRANSACTION|TRANSACTIONS|TRIGGER|TRUNCATE|TSEQUAL|TYPE|TYPES|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNPIVOT|UPDATE|UPDATETEXT|USAGE|USE|USER|USING|VALUE|VALUES|VARBINARY|VARCHAR|VARCHARACTER|VARYING|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH|WITH ROLLUP|WITHIN|WORK|WRITE|WRITETEXT)\b/gi,
    boolean: /\b(TRUE|FALSE|NULL)\b/gi,
    number: /\b-?(0x)?\d*\.?[\da-f]+\b/g,
    operator:
        /\b(ALL|AND|ANY|BETWEEN|EXISTS|IN|LIKE|NOT|OR|IS|UNIQUE|CHARACTER SET|COLLATE|DIV|OFFSET|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b|[-+]{1}|!|=?&lt;|=?&gt;|={1}|(&amp;){1,2}|\|?\||\?|\*|\//gi,
    ignore: /&(lt|gt|amp);/gi,
    punctuation: /[;[\]()`,.]/g
};

Prism.languages.groovy = Prism.languages.extend("clike", {
    keyword:
        /\b(as|def|in|abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while)\b/g,
    string: /("""|''')[\W\w]*?\1|("|'|\/)[\W\w]*?\2/g,
    number: /\b0b[01_]+\b|\b0x[\da-f_]+(\.[\da-f_p\-]+)?\b|\b[\d_]+(\.[\d_]+[e]?[\d]*)?[glidf]\b|[\d_]+(\.[\d_]+)?\b/gi,
    operator:
        /={0,2}~|\?\.|\*?\.@|\.&amp;|\.(?=\w)|\.{2}(&lt;)?(?=\w)|-&gt;|\?:|[-+]{1,2}|!|&lt;=&gt;|(&gt;){1,3}|(&lt;){1,2}|={1,2}|(&amp;){1,2}|\|{1,2}|\?|\*{1,2}|\/|\^|%/g,
    punctuation: /\.+|[{}[\];(),:$]/g,
    annotation: /@\w+/
});

Prism.languages.insertBefore("groovy", "punctuation", {
    "spock-block": /\b(setup|given|when|then|and|cleanup|expect|where):/g
});

Prism.hooks.add("wrap", function (env) {
    if (env.language === "groovy" && env.type === "string") {
        var delimiter = env.content[0];

        if (delimiter !== "'") {
            env.content = Prism.highlight(env.content, {
                expression: {
                    pattern: /([^\\])(\$(\{.*?\}|[\w\.]*))/,
                    lookbehind: true,
                    inside: Prism.languages.groovy
                }
            });

            env.classes.push(delimiter === "/" ? "regex" : "gstring");
        }
    }
});
Prism.languages.http = {
    "request-line": {
        pattern: /^(POST|GET|PUT|DELETE|OPTIONS)\b\shttps?:\/\/\S+\sHTTP\/[0-9.]+/g,
        inside: {
            property: /^\b(POST|GET|PUT|DELETE|OPTIONS)\b/g,
            "attr-name": /:\w+/g
        }
    },
    "response-status": {
        pattern: /^HTTP\/1.[01] [0-9]+.*/g,
        inside: {
            property: /[0-9]+[A-Z\s-]+$/g
        }
    },
    keyword: /^[\w-]+:(?=.+)/gm
};

var httpLanguages = {
    "application/json": Prism.languages.javascript,
    "application/xml": Prism.languages.markup,
    "text/xml": Prism.languages.markup,
    "text/html": Prism.languages.markup
};

for (var contentType in httpLanguages) {
    if (httpLanguages[contentType]) {
        var options = {};
        options[contentType] = {
            pattern: new RegExp(
                "(content-type:\\s*" + contentType + "[\\w\\W]*?)\\n\\n[\\w\\W]*",
                "gi"
            ),
            lookbehind: true,
            inside: {
                rest: httpLanguages[contentType]
            }
        };
        Prism.languages.insertBefore("http", "keyword", options);
    }
}

Prism.languages.ruby = Prism.languages.extend("clike", {
    comment: /#[^\r\n]*(\r?\n|$)/g,
    keyword:
        /\b(alias|and|BEGIN|begin|break|case|class|def|define_method|defined|do|each|else|elsif|END|end|ensure|false|for|if|in|module|new|next|nil|not|or|raise|redo|require|rescue|retry|return|self|super|then|throw|true|undef|unless|until|when|while|yield)\b/g,
    builtin:
        /\b(Array|Bignum|Binding|Class|Continuation|Dir|Exception|FalseClass|File|Stat|File|Fixnum|Fload|Hash|Integer|IO|MatchData|Method|Module|NilClass|Numeric|Object|Proc|Range|Regexp|String|Struct|TMS|Symbol|ThreadGroup|Thread|Time|TrueClass)\b/,
    constant: /\b[A-Z][a-zA-Z_0-9]*[?!]?\b/g
});

Prism.languages.insertBefore("ruby", "keyword", {
    regex: {
        pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/g,
        lookbehind: true
    },
    variable: /[@$&]+\b[a-zA-Z_][a-zA-Z_0-9]*[?!]?\b/g,
    symbol: /:\b[a-zA-Z_][a-zA-Z_0-9]*[?!]?\b/g
});
