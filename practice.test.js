import test from 'node:test';
import assert from 'node:assert/strict';
import {parseWords,pickSet,secondsLeft} from './practice.js';
test('word import trims blanks and deduplicates without changing display spelling',()=>assert.deepEqual(parseWords('Apple\napple, pear;\n banana '),['Apple','pear','banana']));
test('sets have five unique source words without changing the list',()=>{const words=['a','b','c','d','e','f','g'];const copy=[...words];for(let i=0;i<100;i++){const result=pickSet(words);assert.equal(result.length,5);assert.equal(new Set(result).size,5);assert.ok(result.every(w=>words.includes(w)));}assert.deepEqual(words,copy);});
test('timer uses elapsed time even when callbacks are delayed',()=>{assert.equal(secondsLeft(31000,1000),30);assert.equal(secondsLeft(31000,1501),30);assert.equal(secondsLeft(31000,30500),1);assert.equal(secondsLeft(31000,90000),0);});
