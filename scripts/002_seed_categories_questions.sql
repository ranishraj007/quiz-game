-- Seed categories
INSERT INTO public.categories (name, slug, description, icon, color) VALUES
  ('Geography', 'geography', 'Test your knowledge of countries, flags, and capitals', 'globe', '#3B82F6'),
  ('Music', 'music', 'Identify songs, artists, and musical knowledge', 'music', '#8B5CF6'),
  ('Health', 'health', 'Learn about the human body and medical facts', 'heart', '#EF4444'),
  ('Science', 'science', 'Explore physics, chemistry, and natural sciences', 'atom', '#10B981'),
  ('History', 'history', 'Journey through time and historical events', 'landmark', '#F59E0B')
ON CONFLICT (slug) DO NOTHING;

-- Seed sample questions for Geography
INSERT INTO public.questions (category_id, question, correct_answer, wrong_answers, difficulty, media_url, media_type) 
SELECT 
  c.id,
  q.question,
  q.correct_answer,
  q.wrong_answers,
  q.difficulty,
  q.media_url,
  q.media_type
FROM public.categories c
CROSS JOIN (VALUES
  ('What country does this flag belong to?', 'Japan', ARRAY['China', 'South Korea', 'Vietnam'], 1, 'https://flagcdn.com/w320/jp.png', 'flag'),
  ('What country does this flag belong to?', 'Brazil', ARRAY['Argentina', 'Colombia', 'Portugal'], 1, 'https://flagcdn.com/w320/br.png', 'flag'),
  ('What country does this flag belong to?', 'Canada', ARRAY['United States', 'France', 'Australia'], 1, 'https://flagcdn.com/w320/ca.png', 'flag'),
  ('What country does this flag belong to?', 'Germany', ARRAY['Belgium', 'Austria', 'Netherlands'], 1, 'https://flagcdn.com/w320/de.png', 'flag'),
  ('What country does this flag belong to?', 'Australia', ARRAY['New Zealand', 'United Kingdom', 'Fiji'], 1, 'https://flagcdn.com/w320/au.png', 'flag'),
  ('What is the capital of France?', 'Paris', ARRAY['London', 'Berlin', 'Madrid'], 1, NULL, NULL),
  ('What is the largest country by area?', 'Russia', ARRAY['Canada', 'United States', 'China'], 2, NULL, NULL),
  ('Which river is the longest in the world?', 'Nile', ARRAY['Amazon', 'Yangtze', 'Mississippi'], 2, NULL, NULL),
  ('What country does this flag belong to?', 'Nepal', ARRAY['Bhutan', 'Tibet', 'Bangladesh'], 3, 'https://flagcdn.com/w320/np.png', 'flag'),
  ('What country does this flag belong to?', 'Bhutan', ARRAY['Nepal', 'Myanmar', 'Laos'], 3, 'https://flagcdn.com/w320/bt.png', 'flag')
) AS q(question, correct_answer, wrong_answers, difficulty, media_url, media_type)
WHERE c.slug = 'geography';

-- Seed sample questions for Science
INSERT INTO public.questions (category_id, question, correct_answer, wrong_answers, difficulty) 
SELECT 
  c.id,
  q.question,
  q.correct_answer,
  q.wrong_answers,
  q.difficulty
FROM public.categories c
CROSS JOIN (VALUES
  ('What is the chemical symbol for water?', 'H2O', ARRAY['CO2', 'NaCl', 'O2'], 1),
  ('What planet is known as the Red Planet?', 'Mars', ARRAY['Venus', 'Jupiter', 'Mercury'], 1),
  ('What is the speed of light?', '299,792 km/s', ARRAY['150,000 km/s', '500,000 km/s', '1,000,000 km/s'], 2),
  ('What is the smallest unit of matter?', 'Atom', ARRAY['Molecule', 'Cell', 'Electron'], 1),
  ('What gas do plants absorb from the atmosphere?', 'Carbon Dioxide', ARRAY['Oxygen', 'Nitrogen', 'Hydrogen'], 1)
) AS q(question, correct_answer, wrong_answers, difficulty)
WHERE c.slug = 'science';

-- Seed sample questions for Health
INSERT INTO public.questions (category_id, question, correct_answer, wrong_answers, difficulty) 
SELECT 
  c.id,
  q.question,
  q.correct_answer,
  q.wrong_answers,
  q.difficulty
FROM public.categories c
CROSS JOIN (VALUES
  ('What organ pumps blood through the body?', 'Heart', ARRAY['Liver', 'Lungs', 'Brain'], 1),
  ('How many bones are in the adult human body?', '206', ARRAY['186', '226', '256'], 2),
  ('What is the largest organ in the human body?', 'Skin', ARRAY['Liver', 'Heart', 'Brain'], 1),
  ('What type of blood cells fight infection?', 'White blood cells', ARRAY['Red blood cells', 'Platelets', 'Plasma'], 1),
  ('What is the average resting heart rate for adults?', '60-100 bpm', ARRAY['40-60 bpm', '100-120 bpm', '120-140 bpm'], 2)
) AS q(question, correct_answer, wrong_answers, difficulty)
WHERE c.slug = 'health';

-- Seed sample questions for History
INSERT INTO public.questions (category_id, question, correct_answer, wrong_answers, difficulty) 
SELECT 
  c.id,
  q.question,
  q.correct_answer,
  q.wrong_answers,
  q.difficulty
FROM public.categories c
CROSS JOIN (VALUES
  ('In what year did World War II end?', '1945', ARRAY['1944', '1946', '1943'], 1),
  ('Who was the first President of the United States?', 'George Washington', ARRAY['Thomas Jefferson', 'Abraham Lincoln', 'John Adams'], 1),
  ('What ancient wonder was located in Egypt?', 'Great Pyramid of Giza', ARRAY['Hanging Gardens', 'Colossus of Rhodes', 'Lighthouse of Alexandria'], 1),
  ('Which empire built the Colosseum?', 'Roman Empire', ARRAY['Greek Empire', 'Ottoman Empire', 'Byzantine Empire'], 1),
  ('What year did the Berlin Wall fall?', '1989', ARRAY['1987', '1991', '1985'], 2)
) AS q(question, correct_answer, wrong_answers, difficulty)
WHERE c.slug = 'history';

-- Seed sample questions for Music
INSERT INTO public.questions (category_id, question, correct_answer, wrong_answers, difficulty) 
SELECT 
  c.id,
  q.question,
  q.correct_answer,
  q.wrong_answers,
  q.difficulty
FROM public.categories c
CROSS JOIN (VALUES
  ('Who is known as the King of Pop?', 'Michael Jackson', ARRAY['Elvis Presley', 'Prince', 'Madonna'], 1),
  ('What instrument has 88 keys?', 'Piano', ARRAY['Guitar', 'Violin', 'Organ'], 1),
  ('Which band performed "Bohemian Rhapsody"?', 'Queen', ARRAY['The Beatles', 'Led Zeppelin', 'Pink Floyd'], 1),
  ('How many strings does a standard guitar have?', '6', ARRAY['4', '8', '12'], 1),
  ('What is the highest female singing voice?', 'Soprano', ARRAY['Alto', 'Mezzo-soprano', 'Contralto'], 2)
) AS q(question, correct_answer, wrong_answers, difficulty)
WHERE c.slug = 'music';

-- Add lightweight explanations for immediate answer feedback.
UPDATE public.questions
SET explanation = 'The correct answer is ' || correct_answer || '. Use the feedback to reinforce the fact before the next timed question.'
WHERE explanation IS NULL;

INSERT INTO public.achievements (code, name, description, icon, xp_reward) VALUES
  ('first_run', 'First Run', 'Complete your first quiz attempt.', 'play', 50),
  ('combo_builder', 'Combo Builder', 'Reach a streak of three correct answers.', 'flame', 100),
  ('point_hunter', 'Point Hunter', 'Score 5,000 total points.', 'trophy', 250)
ON CONFLICT (code) DO NOTHING;
