"""Create the decorative mission video from the author's untouched choque.mp4.
Run: python3 scripts/prepare-collision.py /absolute/path/to/choque.mp4
Requires ffmpeg. Output is a silent, slow, reversible loop with the site's palette.
"""
import argparse
from pathlib import Path
import subprocess
import tempfile

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', type=Path)
args = parser.parse_args()
assets = Path(__file__).resolve().parents[1] / 'src/assets'
with tempfile.TemporaryDirectory(prefix='nebula-collision-') as work:
    palette = Path(work) / 'palette.cube'
    # Remove neutral chart paper/ink; preserve the three particle populations.
    # Blue halo -> violet, orange disk -> pink, green bulge -> warm yellow.
    with palette.open('w') as lut:
        lut.write('LUT_3D_SIZE 33\n')
        for blue in range(33):
            for green in range(33):
                for red in range(33):
                    r, g, b = red / 32, green / 32, blue / 32
                    weights = (max(b-r, 0), max(r-b, 0), max(g-max(r, b), 0))
                    total = sum(weights)
                    intensity = max(0, min(1, (max(r,g,b)-min(r,g,b)-.07) / .58)) ** 1.8
                    colors = ((.26,.14,.46), (.988,.643,.737), (.992,.867,.275))
                    output = [intensity * sum(w*c[channel] for w,c in zip(weights,colors)) / total if total else 0 for channel in range(3)]
                    lut.write(' '.join(f'{value:.6f}' for value in output) + '\n')
    # Coordinates refer to the supplied 1920x1080 recording. Legends switch corners.
    graph = (
        '[0:v]crop=824:824:562:134,'
        'delogo=x=4:y=4:w=176:h=90,'
        'delogo=x=4:y=730:w=176:h=90,'
        f'lut3d=file={palette},scale=720:720,split[detail][bloom];'
        '[bloom]gblur=sigma=2[soft];'
        '[detail][soft]blend=all_mode=screen:all_opacity=0.35,'
        'setpts=3*(PTS-STARTPTS),fps=20,split[forward][back];'
        '[back]reverse,setpts=PTS-STARTPTS[return];'
        '[forward][return]concat=n=2:v=1:a=0,format=yuv420p[out]'
    )
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(args.source.resolve()), '-filter_complex', graph, '-map', '[out]', '-an', '-c:v', 'libx264', '-crf', '27', '-preset', 'medium', '-movflags', '+faststart', str(assets/'choque-nebula.mp4')], check=True)
    # Poster uses the same frame/palette as the video, even when motion is paused.
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(assets/'choque-nebula.mp4'), '-frames:v', '1', '-q:v', '3', str(assets/'choque-nebula-poster.jpg')], check=True)
print('Prepared choque-nebula.mp4 and its poster.')
