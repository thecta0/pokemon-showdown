'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Battle Armor', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should prevent moves from dealing critical hits', () => {
		battle = common.createBattle([
			[{ species: 'Slowbro', ability: 'battlearmor', moves: ['quickattack'] }],
			[{ species: 'Cryogonal', ability: 'noguard', moves: ['frostbreath'] }],
		]);
		let successfulEvent = false;
		battle.onEvent('ModifyDamage', battle.format, (damage, attacker, defender, move) => {
			if (move.id === 'frostbreath') {
				successfulEvent = true;
				assert(!defender.getMoveHitData(move).crit);
			}
		});
		battle.makeChoices('move quickattack', 'move frostbreath');
		assert(successfulEvent);
	});

	it('should be suppressed by Mold Breaker', () => {
		battle = common.createBattle([
			[{ species: 'Slowbro', ability: 'battlearmor', moves: ['quickattack'] }],
			[{ species: 'Cryogonal', ability: 'moldbreaker', item: 'zoomlens', moves: ['frostbreath'] }],
		]);
		battle.makeChoices('move quickattack', 'move frostbreath');
		let successfulEvent = false;
		battle.onEvent('ModifyDamage', battle.format, (damage, attacker, defender, move) => {
			if (move.id === 'frostbreath') {
				successfulEvent = true;
				assert(defender.getMoveHitData(move).crit);
			}
		});
		battle.makeChoices('move quickattack', 'move frostbreath');
		assert(successfulEvent);
	});
});
