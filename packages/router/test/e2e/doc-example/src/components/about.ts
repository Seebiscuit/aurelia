import { inject } from '@aurelia/kernel';
import { customElement, ICustomElement } from '@aurelia/runtime';
import { Router } from '../../../../../src';
import { State } from '../state';
import { wait } from '../utils';

@customElement({
  name: 'about', template: `<template>
<h3>Basic routing example: authors and books</h3>
<p>This application lists authors and books and shows their details.</p>
<p>This About component is displayed at application start and when navigating to Authors or Books lists in the navbar above.</p>
<p style="color: blue;">Scroll the text below and type something in the input. Then select an <i>author</i> and after that navigate to About. Select an <i>author</i> again and type into and scroll the contents of the tabs. Also: Write different things in the different chat inputs and switch between them.</p>
<p style="color: blue;">The viewports <strong>content</strong>, <strong>author-tabs</strong> and <strong>chat-details</strong> are all <strong>stateful</strong>.</p>
<div style="height: 200px; overflow: auto;" id="scrolled"><pre>
Scroll me to the moon
Let me play among the stars
Let me see what spring is like
On a-Jupiter and Mars
In other words, hold my hand
In other words, baby, kiss me
Fill my heart with song and
Let me sing forever more
You are all I long for
All I worship and adore
In other words, please be true
In other words, I scroll you
Fill my heart with song
Let me sing forever more
You are all I long for
All I worship and I adore
In other words, please be true
In other words
In other words, I scroll you
</pre></div>
<br>
<input>
<span style="display: inline-block; width: 150px; border: 1px solid green" click.trigger="goClick(false)">Go</span>
<span style="display: inline-block; width: 150px; border: 1px solid green" click.trigger="goClick(true)">Go with suppress</span>
</template>` })
@inject(State, Router)
export class About {
  constructor(private readonly state: State, private readonly router: Router) { }

  public enter() {
    return wait(this.state.noDelay ? 0 : 4000);
  }
  async goClick(suppress) {
    await this.router.historyBrowser.history.pushState('books', null, '#books');
    // tslint:disable-next-line:no-console
    console.log('books', this.router.historyBrowser.history.history.state);
    await this.router.historyBrowser.history.pushState('two', null, '#two');
    // tslint:disable-next-line:no-console
    console.log('two', this.router.historyBrowser.history.history.state);
    await this.router.historyBrowser.history.go(-1, suppress);
    // tslint:disable-next-line:no-console
    console.log('books', this.router.historyBrowser.history.history.state);
  }
}
export interface About extends ICustomElement<HTMLElement> { }
