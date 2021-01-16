import React from 'react';
import { rest } from 'msw';
import { App } from './App';

const config = {
  title: 'Demos/Fetch',
  component: App,
};

export default config;

export const DefaultBehavior = () => <App />;

const MockTemplate = (args) => <App {...args} />;

const films = [
  {
    title: 'A New Hope',
    episode_id: 4,
    opening_crawl: `(Mocked) Rebel spaceships have won their first victory against the evil Galactic Empire.`,
  },
  {
    title: 'Empire Strikes Back',
    episode_id: 5,
    opening_crawl: `(Mocked) Imperial troops are pursuing the Rebel forces across the galaxy.`,
  },
  {
    title: 'Return of the Jedi',
    episode_id: 6,
    opening_crawl: `(Mocked) Luke Skywalker has returned to his home planet of Tatooine to rescue Han Solo.`,
  },
];

export const MockedSuccess = MockTemplate.bind({});
MockedSuccess.args = {
  filmTitle: 'My Movie',
  triggerRefetch: 1,
};
MockedSuccess.story = {
  parameters: {
    msw(args) {
      const { filmTitle } = args;

      const [firstFilm, ...otherFilms] = films;

      const newFirstFilm = {
        ...firstFilm,
        title: filmTitle,
      };

      const allFilms = [newFirstFilm, ...otherFilms];

      return [
        rest.get('https://swapi.dev/api/films/', (req, res, ctx) => {
          return res(
            ctx.json({
              results: allFilms,
            }),
          );
        }),
      ];
    },
  },
};

export const MockedError = MockTemplate.bind({});
MockedError.story = {
  parameters: {
    msw: [
      rest.get('https://swapi.dev/api/films/', (req, res, ctx) => {
        return res(
          ctx.delay(800),
          ctx.status(403),
        );
      }),
    ],
  },
};
