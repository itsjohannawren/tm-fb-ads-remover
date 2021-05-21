const
	Chai = require ("chai"),
	assert = Chai.assert,
	expect = Chai.expect;

describe ("node-app-skeleton", () => {
	before (() => {
	});

	afterEach (() => {
	});

	describe ("The Lie", () => {
		context ("Reality", () => {
			it ("should know 2 + 2 == 4", () => {
				expect (Math.round (2.4) + Math.round (2.4)).equal (4);
			});
		});
		context ("Blizzard", () => {
			it ("should know 2 + 2 == 5", () => {
				expect (Math.round (2.4 + 2.4)).equal (5);
			});
		});
	});

	describe ("The Truth", () => {
		context ("Reality", () => {
			it ("should know ‖2.4‖ + ‖2.4‖ == 4", () => {
				expect (Math.round (2.4) + Math.round (2.4)).equal (4);
			});
		});
		context ("Blizzard", () => {
			it ("should know ‖2.4 + 2.4‖ == 5", () => {
				expect (Math.round (2.4 + 2.4)).equal (5);
			});
		});
	});

	it ("should know about true equality", () => {
		assert.deepStrictEqual ([[[1, 2, 3]], 4, 5], [[[1, 2, 3]], 4, 5]);
	});
});
