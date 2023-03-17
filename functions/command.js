// ===================================================================
// ====================== Command Function ===========================
// ===================================================================

const search = require("search-this");
const { translate: ts } = require('bing-translate-api');

const googleOptions = {
  page: 0, 
  safe: false, // Safe Search
  parse_ads: false, // If set to true sponsored results will be parsed
  // additional_params: { 
    // add additional parameters here, see https://moz.com/blog/the-ultimate-guide-to-the-google-search-parameters and https://www.seoquake.com/blog/google-search-param/
    // hl: 'en' 
  // }
}

async function translate(text, from = 'auto-detect', to = 'en') {
  const correctAble = [
    'da', 'en', 'nl', 'fi', 'fr', 'fr-CA',
    'de', 'it', 'ja', 'ko', 'no', 'pl', 'pt', 'pt-PT',
    'ru', 'es', 'sv', 'tr', 'zh-Hant', 'zh-Hans'
  ];

  const response = await ts(text, from, to, correctAble.includes(from)).then((response) => {
    return response;
  }).catch((error) => {
    console.error(error);
  });

  return response;
}

async function pfp(user) {
  if (user.avatar != null) {
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=2048`;
  }

  return user.displayAvatarURL();
}


// ===========================================================================

async function doGoogle(interaction, text, site, ephemeral) {
  try {
    const response = await search(`${text}${site != null ? ' site:' + site : ''}`,googleOptions);

    await interaction.reply({ content: response.results[0].link, ephemeral: ephemeral });

    response.results.slice(1, 4).forEach(async (item) => {
      const context = { content: item.link, ephemeral: ephemeral };

      if (typeof interaction.followUp !== 'undefined') {
        await interaction.followUp(context);
      } else {
        await interaction.reply(context);
      }
    });

  } catch (error) {
    await interaction.reply("Couldn't reach Google API, please try again later");
  }
}


module.exports = {
  translate, pfp, doGoogle
};
