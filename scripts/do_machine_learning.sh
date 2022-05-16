#!/bin/bash

ml_dir="../Real-Time-Voice-Cloning"
sounds_dir="./public/sounds"

source_ogx_file="${sounds_dir}/${1}_source.ogx"
source_file="${sounds_dir}/${1}_source.wav"
encoding_file="${sounds_dir}/${1}_encoding.enc"
true_file="${sounds_dir}/${1}_true.wav"
lie_file="${sounds_dir}/${1}_lie.wav"
communicate_file="${sounds_dir}/${1}_communicate.wav"

# Convert to WAV
ffmpeg -i $source_ogx_file $source_file

# Run ML
echo "Building ${1} embedding"
python "${ml_dir}/voice_to_embedding.py" --source_voice_fpath=${source_file} --output_fpath=${encoding_file} > /dev/null
echo "  done"
echo "Synthesising ${1} vocals"
python "${ml_dir}/embedding_to_vocals.py" --source_encoding_fpath=${encoding_file} --output_fpath=${true_file} --text="truth" > /dev/null
python "${ml_dir}/embedding_to_vocals.py" --source_encoding_fpath=${encoding_file} --output_fpath=${lie_file} --text="lie" > /dev/null
python "${ml_dir}/embedding_to_vocals.py" --source_encoding_fpath=${encoding_file} --output_fpath=${communicate_file} --text="communicate" > /dev/null
echo "  done"

