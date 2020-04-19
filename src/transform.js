const ld = require('lodash');

exports.transform = data => {
  delete data.members[data.owner_id];
  delete data.members['910939'];
  const flattened = ld.flatMap(data.members, (details, memberId) => {
    const result = [];
    const { local_score, name, completion_day_level, stars } = details;
    const num_of_stars = +stars;
    ld.forEach(completion_day_level, (stars, level) => {
      const record = { name, local_score, level: +level, stars: num_of_stars };
      const date = new Date(+stars['1'].get_star_ts * 1000);
      stars['1'].ts = date.toISOString();
      delete stars['1'].get_star_ts;
      Object.assign(stars['1'], record);
      result.push(stars['1']);
      if (stars['2']) {
        const date = new Date(+stars['2'].get_star_ts * 1000);
        stars['2'].ts = date.toISOString();
        Object.assign(stars['2'], record);
        delete stars['2'].get_star_ts;
        result.push(stars['2']);
      }
    });
    return result;
  });
  return flattened;
};
