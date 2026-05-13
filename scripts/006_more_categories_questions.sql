-- Add more QuizVerse categories and expand existing question banks.
-- Run after 004_expand_categories_questions.sql. This script is safe to run more than once.

INSERT INTO public.categories (name, slug, description, icon, color) VALUES
  ('Art', 'art', 'Explore paintings, sculpture, design, artists, museums, and visual movements.', 'palette', '#F97316'),
  ('Food', 'food', 'Taste your way through cuisines, ingredients, cooking methods, and food history.', 'utensils', '#84CC16'),
  ('Nature', 'nature', 'Discover ecosystems, plants, animals, weather, conservation, and wild places.', 'leaf', '#14B8A6'),
  ('Space', 'space', 'Launch into planets, stars, spacecraft, astronomy, and cosmic discoveries.', 'rocket', '#0EA5E9')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color;

WITH question_bank(slug, question, correct_answer, wrong_answers, difficulty, explanation) AS (
  VALUES
  ('geography', 'Which country has the city of Casablanca?', 'Morocco', ARRAY['Algeria', 'Tunisia', 'Egypt'], 1, 'Casablanca is Morocco''s largest city and a major Atlantic port.'),
  ('geography', 'What is the capital of Canada?', 'Ottawa', ARRAY['Toronto', 'Vancouver', 'Montreal'], 1, 'Ottawa is Canada''s federal capital city.'),
  ('geography', 'Which river forms much of the border between Mexico and the United States?', 'Rio Grande', ARRAY['Colorado River', 'Mississippi River', 'Columbia River'], 2, 'The Rio Grande forms a long section of the US-Mexico border.'),
  ('geography', 'Which country is home to the city of Dubrovnik?', 'Croatia', ARRAY['Slovenia', 'Montenegro', 'Albania'], 2, 'Dubrovnik is a historic coastal city in Croatia.'),
  ('geography', 'What is the largest country in South America by area?', 'Brazil', ARRAY['Argentina', 'Peru', 'Colombia'], 1, 'Brazil is the largest South American country by both area and population.'),
  ('geography', 'Which strait separates Spain from Morocco?', 'Strait of Gibraltar', ARRAY['Bosporus Strait', 'Dover Strait', 'Bering Strait'], 2, 'The Strait of Gibraltar connects the Atlantic Ocean and Mediterranean Sea.'),
  ('geography', 'Which country contains the ruins of Machu Picchu?', 'Peru', ARRAY['Bolivia', 'Chile', 'Ecuador'], 1, 'Machu Picchu is an Inca site in Peru.'),
  ('geography', 'Which US state has the nickname the Last Frontier?', 'Alaska', ARRAY['Montana', 'Wyoming', 'Maine'], 2, 'Alaska is commonly nicknamed the Last Frontier.'),

  ('science', 'What gas do plants absorb from the air during photosynthesis?', 'Carbon dioxide', ARRAY['Oxygen', 'Nitrogen', 'Helium'], 1, 'Plants use carbon dioxide and water to make sugars during photosynthesis.'),
  ('science', 'Which blood type is often called the universal red cell donor?', 'O negative', ARRAY['AB positive', 'A positive', 'B negative'], 2, 'O negative red blood cells can be given to many patients in emergencies.'),
  ('science', 'What is the boiling point of water at sea level in Celsius?', '100 C', ARRAY['0 C', '50 C', '212 C'], 1, 'Pure water boils at 100 degrees Celsius at standard sea-level pressure.'),
  ('science', 'Which part of an atom has a positive charge?', 'Proton', ARRAY['Electron', 'Neutron', 'Molecule'], 1, 'Protons carry positive electric charge.'),
  ('science', 'What is the main gas released when vinegar reacts with baking soda?', 'Carbon dioxide', ARRAY['Hydrogen', 'Oxygen', 'Nitrogen'], 2, 'The acid-base reaction releases carbon dioxide gas.'),
  ('science', 'Which branch of science studies earthquakes?', 'Seismology', ARRAY['Meteorology', 'Ecology', 'Astronomy'], 2, 'Seismology is the study of earthquakes and seismic waves.'),
  ('science', 'What is the process of a solid changing directly into a gas called?', 'Sublimation', ARRAY['Condensation', 'Deposition', 'Melting'], 3, 'Sublimation is the direct change from solid to gas.'),
  ('science', 'What is the chemical formula for table salt?', 'NaCl', ARRAY['H2O', 'CO2', 'KCl'], 1, 'Table salt is sodium chloride, written as NaCl.'),

  ('health', 'Which vitamin helps blood clot normally?', 'Vitamin K', ARRAY['Vitamin C', 'Vitamin D', 'Vitamin B6'], 2, 'Vitamin K is needed for normal blood clotting.'),
  ('health', 'What is the common term for the clavicle?', 'Collarbone', ARRAY['Shinbone', 'Jawbone', 'Breastbone'], 1, 'The clavicle is commonly called the collarbone.'),
  ('health', 'Which chamber of the heart pumps blood to the body?', 'Left ventricle', ARRAY['Right atrium', 'Left atrium', 'Right ventricle'], 3, 'The left ventricle pumps oxygenated blood into the aorta.'),
  ('health', 'What does dehydration mean?', 'The body has lost too much water', ARRAY['The body has too much oxygen', 'The body has low bone density', 'The body has extra protein'], 1, 'Dehydration happens when fluid loss exceeds fluid intake.'),
  ('health', 'Which organ stores bile?', 'Gallbladder', ARRAY['Kidney', 'Spleen', 'Lung'], 2, 'The gallbladder stores bile made by the liver.'),
  ('health', 'What is the main purpose of white blood cells?', 'Fight infection', ARRAY['Carry oxygen', 'Store calcium', 'Digest sugar'], 1, 'White blood cells are part of the immune defense system.'),
  ('health', 'Which sense uses the retina?', 'Sight', ARRAY['Hearing', 'Smell', 'Taste'], 1, 'The retina is light-sensitive tissue in the eye.'),
  ('health', 'What does the pulse measure?', 'Heartbeats', ARRAY['Body temperature', 'Blood sugar', 'Lung capacity'], 1, 'A pulse is the pressure wave from heartbeats through arteries.'),

  ('history', 'Which ancient civilization built the city of Tenochtitlan?', 'Aztec', ARRAY['Inca', 'Maya', 'Olmec'], 2, 'Tenochtitlan was the capital of the Aztec Empire.'),
  ('history', 'Who was the British prime minister for much of World War II?', 'Winston Churchill', ARRAY['Neville Chamberlain', 'Clement Attlee', 'Anthony Eden'], 1, 'Churchill led Britain through much of World War II.'),
  ('history', 'Which empire built roads across much of Europe, North Africa, and western Asia?', 'Roman Empire', ARRAY['Mali Empire', 'Inca Empire', 'Khmer Empire'], 1, 'Roman roads helped move armies, trade, and messages across the empire.'),
  ('history', 'What was the name of the first artificial satellite launched in 1957?', 'Sputnik 1', ARRAY['Explorer 1', 'Vostok 1', 'Apollo 1'], 2, 'The Soviet Union launched Sputnik 1 in 1957.'),
  ('history', 'Which queen ruled England during the defeat of the Spanish Armada?', 'Elizabeth I', ARRAY['Victoria', 'Mary I', 'Anne'], 2, 'The Spanish Armada was defeated during Elizabeth I''s reign in 1588.'),
  ('history', 'Which civilization is associated with the city of Chichen Itza?', 'Maya', ARRAY['Aztec', 'Inca', 'Phoenician'], 2, 'Chichen Itza was a major Maya city on the Yucatan Peninsula.'),
  ('history', 'What movement used boycotts and marches to fight segregation in the United States?', 'Civil rights movement', ARRAY['Temperance movement', 'Romantic movement', 'Populist movement'], 1, 'The civil rights movement challenged racial segregation and discrimination.'),
  ('history', 'Which explorer led the first expedition to circumnavigate the globe, though he died en route?', 'Ferdinand Magellan', ARRAY['Christopher Columbus', 'Vasco da Gama', 'James Cook'], 2, 'Magellan led the expedition; it was completed by survivors under Juan Sebastian Elcano.'),

  ('music', 'Which clef is most often used for higher-pitched notes on piano?', 'Treble clef', ARRAY['Bass clef', 'Alto clef', 'Percussion clef'], 1, 'Treble clef is commonly used for higher notes.'),
  ('music', 'How many strings does a standard violin have?', '4', ARRAY['5', '6', '8'], 1, 'A standard violin has four strings.'),
  ('music', 'Which genre is associated with artists like Bob Marley?', 'Reggae', ARRAY['Opera', 'Bluegrass', 'Techno'], 1, 'Bob Marley is one of reggae''s best-known artists.'),
  ('music', 'What does a metronome help musicians keep?', 'Steady tempo', ARRAY['Correct lyrics', 'Stage lighting', 'Instrument tuning only'], 1, 'A metronome gives regular clicks to help keep time.'),
  ('music', 'Which instrument has black and white keys?', 'Piano', ARRAY['Violin', 'Trumpet', 'Drum kit'], 1, 'The piano keyboard has black and white keys.'),
  ('music', 'What is an octave?', 'The interval between notes with the same name at different pitches', ARRAY['A group of three drums', 'A type of microphone', 'A silent measure'], 2, 'An octave spans from one note to the next note of the same name.'),
  ('music', 'Which musical period came after the Baroque period?', 'Classical', ARRAY['Medieval', 'Romantic', 'Modernist'], 2, 'The Classical period followed the Baroque period in Western art music.'),
  ('music', 'What is a duet?', 'A performance by two musicians or singers', ARRAY['A song with no melody', 'A very fast tempo', 'A group of eight notes'], 1, 'A duet features two performers.'),

  ('coding', 'Which HTML element creates a hyperlink?', 'a', ARRAY['link', 'href', 'url'], 1, 'The anchor element, written as a, creates hyperlinks.'),
  ('coding', 'Which CSS property controls the space inside an element border?', 'padding', ARRAY['margin', 'gap', 'outline'], 1, 'Padding is the space between content and border.'),
  ('coding', 'What does DOM stand for in web development?', 'Document Object Model', ARRAY['Data Output Method', 'Display Order Map', 'Digital Object Memory'], 2, 'The DOM represents a document as objects that scripts can read and change.'),
  ('coding', 'Which JavaScript array method adds an item to the end?', 'push', ARRAY['pop', 'shift', 'slice'], 1, 'push appends one or more items to an array.'),
  ('coding', 'What status code usually means not found?', '404', ARRAY['200', '301', '500'], 1, 'HTTP 404 means the requested resource was not found.'),
  ('coding', 'Which database concept links rows in two tables?', 'Foreign key', ARRAY['Media query', 'Stack trace', 'Package lock'], 2, 'A foreign key references a row in another table.'),
  ('coding', 'What is TypeScript best known for adding to JavaScript?', 'Static types', ARRAY['A new browser engine', 'Image filters', 'Database storage'], 1, 'TypeScript adds static type checking on top of JavaScript.'),
  ('coding', 'Which Git command shows changed files in your working tree?', 'git status', ARRAY['git merge', 'git remote', 'git tag'], 1, 'git status summarizes staged, unstaged, and untracked changes.'),

  ('technology', 'What does QR stand for in QR code?', 'Quick Response', ARRAY['Quality Record', 'Quantum Route', 'Query Reader'], 2, 'QR means Quick Response.'),
  ('technology', 'Which company developed the iPhone?', 'Apple', ARRAY['Samsung', 'Microsoft', 'Sony'], 1, 'Apple introduced the first iPhone in 2007.'),
  ('technology', 'What is the main purpose of encryption?', 'Protect information by making it unreadable without a key', ARRAY['Increase screen brightness', 'Delete old files', 'Cool a processor'], 2, 'Encryption transforms data so only authorized parties can read it.'),
  ('technology', 'Which device is used to capture printed documents as digital images?', 'Scanner', ARRAY['Router', 'Speaker', 'Projector'], 1, 'A scanner digitizes physical documents or images.'),
  ('technology', 'What does VPN stand for?', 'Virtual Private Network', ARRAY['Verified Public Name', 'Visual Packet Node', 'Variable Power Network'], 2, 'A VPN creates an encrypted network connection through another server.'),
  ('technology', 'Which unit is commonly used for screen refresh rate?', 'Hertz', ARRAY['Watts', 'Pixels', 'Bytes'], 1, 'Refresh rate is measured in hertz.'),
  ('technology', 'What is a backup?', 'A copy of data kept for recovery', ARRAY['A faster processor', 'A screen setting', 'A network cable'], 1, 'Backups help restore data after loss or damage.'),
  ('technology', 'Which term describes unwanted email?', 'Spam', ARRAY['Cache', 'Patch', 'Cookie'], 1, 'Spam is unsolicited or unwanted email.'),

  ('sports', 'How many bases are on a baseball field?', '4', ARRAY['3', '5', '6'], 1, 'Baseball uses first, second, third, and home base.'),
  ('sports', 'Which sport uses a puck?', 'Ice hockey', ARRAY['Tennis', 'Cricket', 'Basketball'], 1, 'Ice hockey is played with a puck.'),
  ('sports', 'In boxing, what does KO stand for?', 'Knockout', ARRAY['Kick out', 'Keeper offside', 'Known order'], 1, 'KO is short for knockout.'),
  ('sports', 'Which country hosted the 2022 FIFA World Cup?', 'Qatar', ARRAY['Russia', 'Brazil', 'Germany'], 1, 'Qatar hosted the 2022 FIFA World Cup.'),
  ('sports', 'How many points is a touchdown worth in American football?', '6', ARRAY['3', '7', '10'], 1, 'A touchdown is worth six points before any conversion attempt.'),
  ('sports', 'Which sport has a libero position?', 'Volleyball', ARRAY['Baseball', 'Golf', 'Boxing'], 2, 'A libero is a defensive specialist in volleyball.'),
  ('sports', 'What surface is the French Open tennis tournament played on?', 'Clay', ARRAY['Grass', 'Hard court', 'Carpet'], 2, 'The French Open is famous for its clay courts.'),
  ('sports', 'In darts, what is the highest score with one standard throw of three darts?', '180', ARRAY['100', '147', '300'], 3, 'Three triple-20 darts score 180.'),

  ('movies', 'Which film features the character Jack Sparrow?', 'Pirates of the Caribbean', ARRAY['National Treasure', 'Master and Commander', 'Hook'], 1, 'Jack Sparrow is the pirate captain from Pirates of the Caribbean.'),
  ('movies', 'What is the name of the awards given by the Academy of Motion Picture Arts and Sciences?', 'Oscars', ARRAY['Grammys', 'Emmys', 'Tonys'], 1, 'The Academy Awards are commonly called the Oscars.'),
  ('movies', 'Which movie features a computer program world called the Grid?', 'Tron', ARRAY['Blade Runner', 'The Social Network', 'Ready Player One'], 2, 'Tron centers on a digital world known as the Grid.'),
  ('movies', 'Who directed Avatar?', 'James Cameron', ARRAY['Peter Jackson', 'Christopher Nolan', 'Denis Villeneuve'], 1, 'James Cameron directed Avatar.'),
  ('movies', 'Which film series features the wizard Gandalf?', 'The Lord of the Rings', ARRAY['Twilight', 'Divergent', 'The Hunger Games'], 1, 'Gandalf appears in The Lord of the Rings and The Hobbit.'),
  ('movies', 'What is a movie prequel?', 'A story set before an earlier released story', ARRAY['A shortened trailer', 'A movie with no dialogue', 'A remake in another language'], 2, 'A prequel takes place earlier in the story timeline.'),
  ('movies', 'Which actor voiced Woody in Toy Story?', 'Tom Hanks', ARRAY['Tim Allen', 'Billy Crystal', 'Robin Williams'], 1, 'Tom Hanks voiced Woody.'),
  ('movies', 'Which 1939 film is set partly in the land of Oz?', 'The Wizard of Oz', ARRAY['Gone with the Wind', 'Mr. Smith Goes to Washington', 'Stagecoach'], 1, 'The Wizard of Oz follows Dorothy into Oz.'),

  ('literature', 'Who wrote The Hobbit?', 'J. R. R. Tolkien', ARRAY['C. S. Lewis', 'Roald Dahl', 'Philip Pullman'], 1, 'Tolkien wrote The Hobbit before The Lord of the Rings.'),
  ('literature', 'Which detective is known for using little grey cells?', 'Hercule Poirot', ARRAY['Sherlock Holmes', 'Sam Spade', 'Philip Marlowe'], 2, 'Agatha Christie''s Poirot often refers to his little grey cells.'),
  ('literature', 'What is a sonnet?', 'A 14-line poem', ARRAY['A five-act play', 'A short fable', 'A chapter title'], 1, 'A sonnet is traditionally a 14-line poem.'),
  ('literature', 'Who wrote The Catcher in the Rye?', 'J. D. Salinger', ARRAY['F. Scott Fitzgerald', 'John Steinbeck', 'Ernest Hemingway'], 2, 'J. D. Salinger wrote The Catcher in the Rye.'),
  ('literature', 'Which novel features the monster created by Victor Frankenstein?', 'Frankenstein', ARRAY['Dracula', 'The Island of Doctor Moreau', 'The Strange Case of Dr Jekyll and Mr Hyde'], 1, 'Victor Frankenstein creates the creature in Mary Shelley''s novel.'),
  ('literature', 'What is foreshadowing?', 'A hint about events that will happen later', ARRAY['A list of sources', 'A repeated rhyme', 'A spelling mistake'], 2, 'Foreshadowing plants clues about later events.'),
  ('literature', 'Which author wrote The Alchemist?', 'Paulo Coelho', ARRAY['Isabel Allende', 'Haruki Murakami', 'Kazuo Ishiguro'], 2, 'Paulo Coelho wrote The Alchemist.'),
  ('literature', 'Which literary form uses actors and dialogue for stage performance?', 'Drama', ARRAY['Essay', 'Memoir', 'Glossary'], 1, 'Drama is written to be performed by actors.'),

  ('art', 'Who painted the Mona Lisa?', 'Leonardo da Vinci', ARRAY['Michelangelo', 'Raphael', 'Caravaggio'], 1, 'Leonardo da Vinci painted the Mona Lisa.'),
  ('art', 'Which artist is famous for Starry Night?', 'Vincent van Gogh', ARRAY['Claude Monet', 'Pablo Picasso', 'Salvador Dali'], 1, 'Van Gogh painted The Starry Night in 1889.'),
  ('art', 'What primary colors are used in traditional RYB painting?', 'Red, yellow, and blue', ARRAY['Red, green, and blue', 'Cyan, magenta, and yellow', 'Orange, purple, and green'], 1, 'Traditional painting color theory uses red, yellow, and blue as primary colors.'),
  ('art', 'Which museum is home to the Mona Lisa?', 'Louvre', ARRAY['Prado', 'Uffizi', 'Tate Modern'], 1, 'The Mona Lisa is displayed at the Louvre in Paris.'),
  ('art', 'What art movement is Claude Monet strongly associated with?', 'Impressionism', ARRAY['Cubism', 'Surrealism', 'Pop art'], 2, 'Monet was a leading Impressionist painter.'),
  ('art', 'Which artist co-founded Cubism with Georges Braque?', 'Pablo Picasso', ARRAY['Henri Matisse', 'Jackson Pollock', 'Paul Klee'], 2, 'Picasso and Braque developed Cubism in the early 20th century.'),
  ('art', 'What is a fresco painted on?', 'Wet plaster', ARRAY['Glass', 'Canvas only', 'Metal plates'], 3, 'Fresco painting applies pigment to wet plaster.'),
  ('art', 'Which sculptor created David in marble during the Renaissance?', 'Michelangelo', ARRAY['Donatello', 'Bernini', 'Rodin'], 2, 'Michelangelo carved the famous marble David.'),
  ('art', 'What does perspective help create in a drawing?', 'The illusion of depth', ARRAY['A louder sound', 'A smoother texture', 'A written rhyme'], 1, 'Perspective makes flat images appear three-dimensional.'),
  ('art', 'Which artist is known for Campbell''s Soup Cans?', 'Andy Warhol', ARRAY['Edward Hopper', 'Georgia O''Keeffe', 'Frida Kahlo'], 1, 'Warhol''s soup can works are icons of Pop art.'),

  ('food', 'Which grain is traditionally used to make sushi rice?', 'Short-grain rice', ARRAY['Barley', 'Quinoa', 'Long-grain basmati'], 1, 'Sushi is commonly made with seasoned short-grain rice.'),
  ('food', 'What is the main ingredient in hummus?', 'Chickpeas', ARRAY['Lentils', 'Potatoes', 'Peanuts'], 1, 'Hummus is made primarily from chickpeas.'),
  ('food', 'Which country is associated with paella?', 'Spain', ARRAY['Portugal', 'Italy', 'Greece'], 1, 'Paella originated in Spain, especially Valencia.'),
  ('food', 'What process makes bread dough rise?', 'Yeast fermentation', ARRAY['Freezing', 'Caramelization only', 'Pickling'], 2, 'Yeast fermentation produces gas that makes dough rise.'),
  ('food', 'Which spice gives turmeric its bright yellow color?', 'Curcumin', ARRAY['Capsaicin', 'Saffron', 'Vanillin'], 3, 'Curcumin is the yellow pigment in turmeric.'),
  ('food', 'What is al dente pasta?', 'Firm to the bite', ARRAY['Overcooked and soft', 'Served cold only', 'Cooked without salt'], 1, 'Al dente means pasta is cooked but still firm.'),
  ('food', 'Which fruit is used to make guacamole?', 'Avocado', ARRAY['Mango', 'Tomato', 'Plantain'], 1, 'Guacamole is based on mashed avocado.'),
  ('food', 'What is pasteurization used for?', 'Reducing harmful microbes in food or drink', ARRAY['Making food spicy', 'Removing all color', 'Adding carbonation'], 2, 'Pasteurization uses heat treatment to reduce harmful microbes.'),
  ('food', 'Which cuisine is known for dishes like kimchi and bulgogi?', 'Korean', ARRAY['Thai', 'Peruvian', 'Moroccan'], 1, 'Kimchi and bulgogi are well-known Korean foods.'),
  ('food', 'What does umami describe?', 'A savory taste', ARRAY['A sour smell', 'A crunchy texture', 'A bitter color'], 2, 'Umami is the savory taste associated with glutamates.'),

  ('nature', 'What is the largest rainforest in the world?', 'Amazon Rainforest', ARRAY['Congo Rainforest', 'Daintree Rainforest', 'Valdivian Rainforest'], 1, 'The Amazon is the world''s largest tropical rainforest.'),
  ('nature', 'What gas do trees release during photosynthesis?', 'Oxygen', ARRAY['Carbon monoxide', 'Methane', 'Nitrogen'], 1, 'Photosynthesis releases oxygen as a byproduct.'),
  ('nature', 'Which biome is known for permafrost?', 'Tundra', ARRAY['Savanna', 'Desert', 'Chaparral'], 2, 'Tundra regions often have permanently frozen ground called permafrost.'),
  ('nature', 'What is the process by which water vapor becomes liquid water?', 'Condensation', ARRAY['Evaporation', 'Sublimation', 'Infiltration'], 1, 'Condensation forms clouds, dew, and other liquid water droplets.'),
  ('nature', 'Which animal is the largest living land animal?', 'African elephant', ARRAY['White rhinoceros', 'Hippopotamus', 'Giraffe'], 1, 'African elephants are the largest living land animals.'),
  ('nature', 'What do bees collect from flowers to make honey?', 'Nectar', ARRAY['Bark', 'Sand', 'Seeds'], 1, 'Bees collect nectar and process it into honey.'),
  ('nature', 'What is an ecosystem?', 'A community of organisms and their physical environment', ARRAY['A single mountain peak', 'A weather forecast', 'A type of mineral'], 2, 'An ecosystem includes living organisms and nonliving surroundings.'),
  ('nature', 'Which layer of the atmosphere contains most weather?', 'Troposphere', ARRAY['Mesosphere', 'Thermosphere', 'Exosphere'], 2, 'Most weather occurs in the troposphere.'),
  ('nature', 'What is biodiversity?', 'The variety of life in an area', ARRAY['The speed of wind', 'The age of a rock', 'The saltiness of water'], 1, 'Biodiversity means variety among living organisms.'),
  ('nature', 'Which natural event is measured with the Richter scale?', 'Earthquake', ARRAY['Hurricane', 'Avalanche', 'Drought'], 2, 'The Richter scale measures earthquake magnitude.'),

  ('space', 'Which planet is closest to the Sun?', 'Mercury', ARRAY['Venus', 'Earth', 'Mars'], 1, 'Mercury orbits closest to the Sun.'),
  ('space', 'What is the name of our galaxy?', 'Milky Way', ARRAY['Andromeda', 'Triangulum', 'Sombrero'], 1, 'The Solar System is in the Milky Way galaxy.'),
  ('space', 'Which planet is known as the Red Planet?', 'Mars', ARRAY['Jupiter', 'Venus', 'Saturn'], 1, 'Mars appears reddish because of iron oxide on its surface.'),
  ('space', 'What force pulls objects toward a planet?', 'Gravity', ARRAY['Magnetism', 'Friction', 'Static electricity'], 1, 'Gravity attracts masses toward one another.'),
  ('space', 'What is a light-year a measure of?', 'Distance', ARRAY['Time', 'Brightness', 'Mass'], 2, 'A light-year is the distance light travels in one year.'),
  ('space', 'Which telescope launched in 1990 and transformed space imagery?', 'Hubble Space Telescope', ARRAY['James Webb Space Telescope', 'Kepler Telescope', 'Spitzer Telescope'], 1, 'Hubble launched in 1990 and produced many iconic space images.'),
  ('space', 'What is the Sun mostly made of?', 'Hydrogen and helium', ARRAY['Iron and nickel', 'Oxygen and carbon', 'Rock and ice'], 1, 'The Sun is mostly hydrogen with a large amount of helium.'),
  ('space', 'Which planet has a Great Red Spot?', 'Jupiter', ARRAY['Neptune', 'Saturn', 'Uranus'], 2, 'Jupiter''s Great Red Spot is a giant storm.'),
  ('space', 'What is the boundary around a black hole called?', 'Event horizon', ARRAY['Asteroid belt', 'Solar flare', 'Corona'], 3, 'The event horizon is the point beyond which light cannot escape a black hole.'),
  ('space', 'Which mission first landed humans on the Moon?', 'Apollo 11', ARRAY['Apollo 8', 'Gemini 4', 'Voyager 1'], 1, 'Apollo 11 landed Neil Armstrong and Buzz Aldrin on the Moon in 1969.')
)
INSERT INTO public.questions (category_id, question, correct_answer, wrong_answers, difficulty, explanation)
SELECT
  c.id,
  qb.question,
  qb.correct_answer,
  qb.wrong_answers,
  qb.difficulty,
  qb.explanation
FROM public.categories c
JOIN question_bank qb ON qb.slug = c.slug
WHERE NOT EXISTS (
  SELECT 1
  FROM public.questions existing
  WHERE existing.category_id = c.id
    AND existing.question = qb.question
    AND existing.correct_answer = qb.correct_answer
);
