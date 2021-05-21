const
	Mustache = require ("mustache"),
	ReadFile = require ("fs").readFileSync,
	WriteFile = require ("fs").writeFileSync;

const
	self = JSON.parse (ReadFile ("package.json")),
	template = ReadFile ("src/script.user.js.template", "utf8"),
	code = ReadFile ("src/all.js", "utf8");

const view = {
	"package": self,
	"tampermonkey": self.tampermonkey,
	"code": code
};

const dist = Mustache.render (template, view);

WriteFile (self.main, dist, "utf8");
