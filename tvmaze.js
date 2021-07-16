/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // Make an ajax request to the searchShows api.

  const result = [];

  const shows = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);

  for (let show of shows.data) {
    result.push({
      id: show.show.id,
      name: show.show.name,
      summary: show.show.summary,
      image: show.show.image.medium,
    });
  }

  return result;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
           </div>
         </div>
       </div>
      `);
    
    if (show.image) {
      $item.find('.card-body').append(`<img class="card-img-top" src="${show.image}" placeholder="">`)
    }

    // set up episode button on card body
    $item.find('.card-body').append($('<button>')
                            .attr('id', `${show.id}`)
                            .text('Episodes')
                            .addClass('show-episodes btn btn-primary')
                            .click(async function () { // asynchronous event listener
                              // get episode id
                              const id = $(this).attr('id');

                              // show episode area
                              $('#episodes-area').show();

                              // await episode data and populate list
                              populateEpisodes(await getEpisodes(id));
                            }));
    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  const episodes = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  const result = [];

  // push episode data to result array
  for (let episode of episodes.data) {
    result.push({
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number,
    });
  }

  // return array-of-episode-info, as described in docstring above
  return result;
}

/** populateEpisodes: renders episode list from array of episode information
 * 
 */

function populateEpisodes(episodes) {
  // empty episode list
  const $episodesList = $('#episodes-list');
  $episodesList.empty();

  // iterate through episodes and append li elements to $episodesList
  for (let episode of episodes) {
    const $li = $('<li>').text(`${episode.name} (season ${episode.season}, number ${episode.number})`);
    $episodesList.append($li);
  }
}

