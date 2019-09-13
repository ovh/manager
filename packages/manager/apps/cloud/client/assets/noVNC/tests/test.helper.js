const assert = chai.assert;
const expect = chai.expect;

describe('Helpers', () => {
  describe('keysymFromKeyCode', () => {
    it('should map known keycodes to keysyms', () => {
      expect(kbdUtil.keysymFromKeyCode(0x41, false), 'a').to.be.equal(0x61);
      expect(kbdUtil.keysymFromKeyCode(0x41, true), 'A').to.be.equal(0x41);
      expect(kbdUtil.keysymFromKeyCode(0xd, false), 'enter').to.be.equal(0xFF0D);
      expect(kbdUtil.keysymFromKeyCode(0x11, false), 'ctrl').to.be.equal(0xFFE3);
      expect(kbdUtil.keysymFromKeyCode(0x12, false), 'alt').to.be.equal(0xFFE9);
      expect(kbdUtil.keysymFromKeyCode(0xe1, false), 'altgr').to.be.equal(0xFE03);
      expect(kbdUtil.keysymFromKeyCode(0x1b, false), 'esc').to.be.equal(0xFF1B);
      expect(kbdUtil.keysymFromKeyCode(0x26, false), 'up').to.be.equal(0xFF52);
    });
    it('should return null for unknown keycodes', () => {
      expect(kbdUtil.keysymFromKeyCode(0xc0, false), 'DK æ').to.be.null;
      expect(kbdUtil.keysymFromKeyCode(0xde, false), 'DK ø').to.be.null;
    });
  });

  describe('keysyms.fromUnicode', () => {
    it('should map ASCII characters to keysyms', () => {
      expect(keysyms.fromUnicode('a'.charCodeAt())).to.have.property('keysym', 0x61);
      expect(keysyms.fromUnicode('A'.charCodeAt())).to.have.property('keysym', 0x41);
    });
    it('should map Latin-1 characters to keysyms', () => {
      expect(keysyms.fromUnicode('ø'.charCodeAt())).to.have.property('keysym', 0xf8);

      expect(keysyms.fromUnicode('é'.charCodeAt())).to.have.property('keysym', 0xe9);
    });
    it('should map characters that are in Windows-1252 but not in Latin-1 to keysyms', () => {
      expect(keysyms.fromUnicode('Š'.charCodeAt())).to.have.property('keysym', 0x01a9);
    });
    it('should map characters which aren\'t in Latin1 *or* Windows-1252 to keysyms', () => {
      expect(keysyms.fromUnicode('ŵ'.charCodeAt())).to.have.property('keysym', 0x1000175);
    });
    it('should return undefined for unknown codepoints', () => {
      expect(keysyms.fromUnicode('\n'.charCodeAt())).to.be.undefined;
      expect(keysyms.fromUnicode('\u1F686'.charCodeAt())).to.be.undefined;
    });
  });

  describe('substituteCodepoint', () => {
    it('should replace characters which don\'t have a keysym', () => {
      expect(kbdUtil.substituteCodepoint('Ș'.charCodeAt())).to.equal('Ş'.charCodeAt());
      expect(kbdUtil.substituteCodepoint('ș'.charCodeAt())).to.equal('ş'.charCodeAt());
      expect(kbdUtil.substituteCodepoint('Ț'.charCodeAt())).to.equal('Ţ'.charCodeAt());
      expect(kbdUtil.substituteCodepoint('ț'.charCodeAt())).to.equal('ţ'.charCodeAt());
    });
    it('should pass other characters through unchanged', () => {
      expect(kbdUtil.substituteCodepoint('T'.charCodeAt())).to.equal('T'.charCodeAt());
    });
  });

  describe('nonCharacterKey', () => {
    it('should  recognize the right keys', () => {
      expect(kbdUtil.nonCharacterKey({ keyCode: 0xd }), 'enter').to.be.defined;
      expect(kbdUtil.nonCharacterKey({ keyCode: 0x08 }), 'backspace').to.be.defined;
      expect(kbdUtil.nonCharacterKey({ keyCode: 0x09 }), 'tab').to.be.defined;
      expect(kbdUtil.nonCharacterKey({ keyCode: 0x10 }), 'shift').to.be.defined;
      expect(kbdUtil.nonCharacterKey({ keyCode: 0x11 }), 'ctrl').to.be.defined;
      expect(kbdUtil.nonCharacterKey({ keyCode: 0x12 }), 'alt').to.be.defined;
      expect(kbdUtil.nonCharacterKey({ keyCode: 0xe0 }), 'meta').to.be.defined;
    });
    it('should  not recognize character keys', () => {
      expect(kbdUtil.nonCharacterKey({ keyCode: 'A' }), 'A').to.be.null;
      expect(kbdUtil.nonCharacterKey({ keyCode: '1' }), '1').to.be.null;
      expect(kbdUtil.nonCharacterKey({ keyCode: '.' }), '.').to.be.null;
      expect(kbdUtil.nonCharacterKey({ keyCode: ' ' }), 'space').to.be.null;
    });
  });

  describe('getKeysym', () => {
    it('should prefer char', () => {
      expect(kbdUtil.getKeysym({
        char: 'a', charCode: 'Š'.charCodeAt(), keyCode: 0x42, which: 0x43,
      })).to.have.property('keysym', 0x61);
    });
    it('should use charCode if no char', () => {
      expect(kbdUtil.getKeysym({
        char: '', charCode: 'Š'.charCodeAt(), keyCode: 0x42, which: 0x43,
      })).to.have.property('keysym', 0x01a9);
      expect(kbdUtil.getKeysym({ charCode: 'Š'.charCodeAt(), keyCode: 0x42, which: 0x43 })).to.have.property('keysym', 0x01a9);
      expect(kbdUtil.getKeysym({
        char: 'hello', charCode: 'Š'.charCodeAt(), keyCode: 0x42, which: 0x43,
      })).to.have.property('keysym', 0x01a9);
    });
    it('should use keyCode if no charCode', () => {
      expect(kbdUtil.getKeysym({ keyCode: 0x42, which: 0x43, shiftKey: false })).to.have.property('keysym', 0x62);
      expect(kbdUtil.getKeysym({ keyCode: 0x42, which: 0x43, shiftKey: true })).to.have.property('keysym', 0x42);
    });
    it('should use which if no keyCode', () => {
      expect(kbdUtil.getKeysym({ which: 0x43, shiftKey: false })).to.have.property('keysym', 0x63);
      expect(kbdUtil.getKeysym({ which: 0x43, shiftKey: true })).to.have.property('keysym', 0x43);
    });
    it('should substitute where applicable', () => {
      expect(kbdUtil.getKeysym({ char: 'Ș' })).to.have.property('keysym', 0x1aa);
    });
  });

  describe('Modifier Sync', () => { // return a list of fake events necessary to fix modifier state
    describe('Toggle all modifiers', () => {
      const sync = kbdUtil.ModifierSync();
      it('should do nothing if all modifiers are up as expected', () => {
        expect(sync.keydown({
          keyCode: 0x41,
          ctrlKey: false,
          altKey: false,
          altGraphKey: false,
          shiftKey: false,
          metaKey: false,
        })).to.have.lengthOf(0);
      });
      it('should synthesize events if all keys are unexpectedly down', () => {
        const result = sync.keydown({
          keyCode: 0x41,
          ctrlKey: true,
          altKey: true,
          altGraphKey: true,
          shiftKey: true,
          metaKey: true,
        });
        expect(result).to.have.lengthOf(5);
        const keysyms = {};
        for (let i = 0; i < result.length; ++i) {
          keysyms[result[i].keysym] = (result[i].type == 'keydown');
        }
        expect(keysyms[0xffe3]);
        expect(keysyms[0xffe9]);
        expect(keysyms[0xfe03]);
        expect(keysyms[0xffe1]);
        expect(keysyms[0xffe7]);
      });
      it('should do nothing if all modifiers are down as expected', () => {
        expect(sync.keydown({
          keyCode: 0x41,
          ctrlKey: true,
          altKey: true,
          altGraphKey: true,
          shiftKey: true,
          metaKey: true,
        })).to.have.lengthOf(0);
      });
    });
    describe('Toggle Ctrl', () => {
      const sync = kbdUtil.ModifierSync();
      it('should sync if modifier is suddenly down', () => {
        expect(sync.keydown({
          keyCode: 0x41,
          ctrlKey: true,
        })).to.be.deep.equal([{ keysym: keysyms.lookup(0xffe3), type: 'keydown' }]);
      });
      it('should sync if modifier is suddenly up', () => {
        expect(sync.keydown({
          keyCode: 0x41,
          ctrlKey: false,
        })).to.be.deep.equal([{ keysym: keysyms.lookup(0xffe3), type: 'keyup' }]);
      });
    });
    describe('Toggle Alt', () => {
      const sync = kbdUtil.ModifierSync();
      it('should sync if modifier is suddenly down', () => {
        expect(sync.keydown({
          keyCode: 0x41,
          altKey: true,
        })).to.be.deep.equal([{ keysym: keysyms.lookup(0xffe9), type: 'keydown' }]);
      });
      it('should sync if modifier is suddenly up', () => {
        expect(sync.keydown({
          keyCode: 0x41,
          altKey: false,
        })).to.be.deep.equal([{ keysym: keysyms.lookup(0xffe9), type: 'keyup' }]);
      });
    });
    describe('Toggle AltGr', () => {
      const sync = kbdUtil.ModifierSync();
      it('should sync if modifier is suddenly down', () => {
        expect(sync.keydown({
          keyCode: 0x41,
          altGraphKey: true,
        })).to.be.deep.equal([{ keysym: keysyms.lookup(0xfe03), type: 'keydown' }]);
      });
      it('should sync if modifier is suddenly up', () => {
        expect(sync.keydown({
          keyCode: 0x41,
          altGraphKey: false,
        })).to.be.deep.equal([{ keysym: keysyms.lookup(0xfe03), type: 'keyup' }]);
      });
    });
    describe('Toggle Shift', () => {
      const sync = kbdUtil.ModifierSync();
      it('should sync if modifier is suddenly down', () => {
        expect(sync.keydown({
          keyCode: 0x41,
          shiftKey: true,
        })).to.be.deep.equal([{ keysym: keysyms.lookup(0xffe1), type: 'keydown' }]);
      });
      it('should sync if modifier is suddenly up', () => {
        expect(sync.keydown({
          keyCode: 0x41,
          shiftKey: false,
        })).to.be.deep.equal([{ keysym: keysyms.lookup(0xffe1), type: 'keyup' }]);
      });
    });
    describe('Toggle Meta', () => {
      const sync = kbdUtil.ModifierSync();
      it('should sync if modifier is suddenly down', () => {
        expect(sync.keydown({
          keyCode: 0x41,
          metaKey: true,
        })).to.be.deep.equal([{ keysym: keysyms.lookup(0xffe7), type: 'keydown' }]);
      });
      it('should sync if modifier is suddenly up', () => {
        expect(sync.keydown({
          keyCode: 0x41,
          metaKey: false,
        })).to.be.deep.equal([{ keysym: keysyms.lookup(0xffe7), type: 'keyup' }]);
      });
    });
    describe('Modifier keyevents', () => {
      it('should not sync a modifier on its own events', () => {
        expect(kbdUtil.ModifierSync().keydown({
          keyCode: 0x11,
          ctrlKey: false,
        })).to.be.deep.equal([]);
        expect(kbdUtil.ModifierSync().keydown({
          keyCode: 0x11,
          ctrlKey: true,
        }), 'B').to.be.deep.equal([]);
      });
      it('should update state on modifier keyevents', () => {
        const sync = kbdUtil.ModifierSync();
        sync.keydown({
          keyCode: 0x11,
        });
        expect(sync.keydown({
          keyCode: 0x41,
          ctrlKey: true,
        })).to.be.deep.equal([]);
      });
      it('should sync other modifiers on ctrl events', () => {
        expect(kbdUtil.ModifierSync().keydown({
          keyCode: 0x11,
          altKey: true,
        })).to.be.deep.equal([{ keysym: keysyms.lookup(0xffe9), type: 'keydown' }]);
      });
    });
    describe('sync modifiers on non-key events', () => {
      it('should generate sync events when receiving non-keyboard events', () => {
        expect(kbdUtil.ModifierSync().syncAny({
          altKey: true,
        })).to.be.deep.equal([{ keysym: keysyms.lookup(0xffe9), type: 'keydown' }]);
      });
    });
    describe('do not treat shift as a modifier key', () => {
      it('should not treat shift as a shortcut modifier', () => {
        expect(kbdUtil.hasShortcutModifier([], { 0xffe1: true })).to.be.false;
      });
      it('should not treat shift as a char modifier', () => {
        expect(kbdUtil.hasCharModifier([], { 0xffe1: true })).to.be.false;
      });
    });
  });
});
