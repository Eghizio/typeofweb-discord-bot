import { expect } from 'chai';
import type * as Discord from 'discord.js';
import nock from 'nock';
import Sinon from 'sinon';

import { getMessageMock } from '../../test/mocks';
import * as Config from '../config';

import youtube from './youtube';

describe('youtube', () => {
  beforeEach(() => {
    void Sinon.stub(Config, 'getConfig').callsFake((name) => {
      if (name === 'YOUTUBE_API_KEY') {
        return 'FAKE_YOUTUBE_KEY';
      }
      throw new Error(`Unexpected config: ${name}`);
    });
  });

  it('should show error message when nothing found on youtube', async () => {
    nock('https://www.googleapis.com')
      .get(
        `/youtube/v3/search?part=id&type=video&key=FAKE_YOUTUBE_KEY&q=moja%20ulubiona%20piosenka`,
      )
      .reply(200, { items: [] });

    const msg = getMessageMock('msg', {});

    await youtube.execute(msg as unknown as Discord.Message, ['moja', 'ulubiona', 'piosenka']);

    expect(msg.channel.send).to.have.been.calledOnce.and.calledWithMatch('Niestety nic');
  });

  it('should show link when found on youtube', async () => {
    nock('https://www.googleapis.com')
      .get(
        `/youtube/v3/search?part=id&type=video&key=FAKE_YOUTUBE_KEY&q=moja%20ulubiona%20piosenka`,
      )
      .reply(200, { items: [{ id: { videoId: 'aaa123' } }] });

    const msg = getMessageMock('msg', {});

    await youtube.execute(msg as unknown as Discord.Message, ['moja', 'ulubiona', 'piosenka']);

    expect(msg.channel.send).to.have.been.calledOnceWith('https://www.youtube.com/watch?v=aaa123');
  });
});
